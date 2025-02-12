import { TextEncoder, TextDecoder } from "util";
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TaskForm from "../TaskForm";
import { addDoc, collection } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  getFirestore: jest.fn(() => ({})),
}));

jest.mock("react-firebase-hooks/auth", () => ({
  useAuthState: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
});

test("should create a new task when form is submitted", async () => {
  // Set up a logged-in user
  useAuthState.mockReturnValue([{ uid: "testUser123" }, false]);

  // Configure Firestore mocks:
  collection.mockReturnValue(jest.fn());
  addDoc.mockResolvedValue({ id: "mockDocId" });

  render(<TaskForm />);

  // Simulate user input
  fireEvent.change(screen.getByPlaceholderText("Task Name"), {
    target: { value: "Test Task" },
  });
  fireEvent.change(screen.getByPlaceholderText("Description"), {
    target: { value: "This is a test task." },
  });

  // Submit the form
  fireEvent.click(screen.getByText("Add Task"));

  // Wait for the asynchronous call to complete
  await waitFor(() => {
    expect(addDoc).toHaveBeenCalledTimes(1);
  });

  expect(addDoc).toHaveBeenCalledWith(expect.any(Function), {
    taskName: "Test Task",
    description: "This is a test task.",
    dueDate: "",
    priority: "Medium",
    userId: "testUser123",
    createdAt: expect.any(Date),
  });
});

test("should not allow task creation without a task name", async () => {
  useAuthState.mockReturnValue([{ uid: "testUser123" }, false]);
  render(<TaskForm />);

  // Click submit without entering a task name
  fireEvent.click(screen.getByText("Add Task"));

  expect(addDoc).not.toHaveBeenCalled();
});

test("should handle Firestore errors gracefully", async () => {
  useAuthState.mockReturnValue([{ uid: "testUser123" }, false]);

  // Configure the error case
  collection.mockReturnValue(jest.fn());
  addDoc.mockRejectedValue(new Error("Firestore error"));

  render(<TaskForm />);

  fireEvent.change(screen.getByPlaceholderText("Task Name"), {
    target: { value: "Test Task" },
  });
  fireEvent.click(screen.getByText("Add Task"));

  // Wait for the error message to appear
  const alert = await screen.findByRole("alert", {
    name: /Error adding document:/i,
  });
  expect(alert).toHaveTextContent(/Error adding document: Firestore error/i);
});

// Additional tests that should pass without any further changes:

test("should render form inputs with correct initial values", () => {
  useAuthState.mockReturnValue([{ uid: "testUser123" }, false]);
  render(<TaskForm />);

  // Check that the input fields are rendered with empty values
  expect(screen.getByPlaceholderText("Task Name")).toHaveValue("");
  expect(screen.getByPlaceholderText("Description")).toHaveValue("");

  // Check that the "Add Task" button is rendered
  expect(screen.getByRole("button", { name: /add task/i })).toBeInTheDocument();

  // Check that the select element has the default value "Medium"
  expect(screen.getByRole("combobox")).toHaveValue("Medium");
});

test("should not display an error message initially", () => {
  useAuthState.mockReturnValue([{ uid: "testUser123" }, false]);
  render(<TaskForm />);

  // There should be no alert element when the component is first rendered
  const alert = screen.queryByRole("alert", { name: /Error adding document:/i });
  expect(alert).not.toBeInTheDocument();
});

test("should not allow task creation when user is not logged in", () => {
  // Simulate no user logged in
  useAuthState.mockReturnValue([null, false]);
  render(<TaskForm />);

  // Enter a task name
  fireEvent.change(screen.getByPlaceholderText("Task Name"), {
    target: { value: "Test Task" },
  });
  fireEvent.click(screen.getByText("Add Task"));

  // Since no user is logged in, addDoc should not be called
  expect(addDoc).not.toHaveBeenCalled();
});
