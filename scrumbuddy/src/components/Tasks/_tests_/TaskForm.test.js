import { TextEncoder, TextDecoder } from "util";
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import { render, screen, fireEvent } from "@testing-library/react";
import TaskForm from "../TaskForm";
import { addDoc } from "firebase/firestore";
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
  useAuthState.mockReturnValue([{ uid: "testUser123" }, false]);

  render(<TaskForm />);

  // Simulate user input
  fireEvent.change(screen.getByPlaceholderText("Task Name"), {
    target: { value: "Test Task" },
  });
  fireEvent.change(screen.getByPlaceholderText("Description"), {
    target: { value: "This is a test task." },
  });

  // Submit form
  fireEvent.click(screen.getByText("Add Task"));

  // Check if Firestore's addDoc was called
  expect(addDoc).toHaveBeenCalledTimes(1);
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

  // Click submit without entering task name
  fireEvent.click(screen.getByText("Add Task"));

  // Ensure addDoc is NOT called
  expect(addDoc).not.toHaveBeenCalled();
});

test("should handle Firestore errors gracefully", async () => {
  useAuthState.mockReturnValue([{ uid: "testUser123" }, false]);
  addDoc.mockRejectedValue(new Error("Firestore error"));

  render(<TaskForm />);

  fireEvent.change(screen.getByPlaceholderText("Task Name"), {
    target: { value: "Test Task" },
  });
  fireEvent.click(screen.getByText("Add Task"));

  // Wait for the error message to appear in the DOM
  expect(
    await screen.findByRole("alert", {
      name: /Error adding document:/i,
    })
  ).toBeInTheDocument();
});
