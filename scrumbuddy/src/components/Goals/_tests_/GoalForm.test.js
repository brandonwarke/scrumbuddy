import { TextEncoder, TextDecoder } from "util";
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GoalForm from "../GoalForm";
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

test("should create a new goal when form is submitted", async () => {
  // Set up a logged-in user
  useAuthState.mockReturnValue([{ uid: "testUser123" }, false]);

  // Configure Firestore mocks:
  collection.mockReturnValue(jest.fn());
  addDoc.mockResolvedValue({ id: "mockDocId" });

  render(<GoalForm />);

  // Simulate user input
  fireEvent.change(screen.getByPlaceholderText("Goal Name"), {
    target: { value: "Test Goal" },
  });
  fireEvent.change(screen.getByPlaceholderText("Description"), {
    target: { value: "This is a test goal." },
  });
  fireEvent.change(screen.getByPlaceholderText("Progress (%)"), {
    target: { value: "50" },
  });

  // Submit the form
  fireEvent.click(screen.getByText("Add Goal"));

  // Wait for the asynchronous call to complete
  await waitFor(() => {
    expect(addDoc).toHaveBeenCalledTimes(1);
  });

  // Expect the goal to be added with the appropriate fields:
  expect(addDoc).toHaveBeenCalledWith(expect.any(Function), {
    goalName: "Test Goal",
    description: "This is a test goal.",
    progress: 50,
    status: "in-progress",
    completedAt: null,
    userId: "testUser123",
    createdAt: expect.any(Object), // serverTimestamp sentinel
  });
});

test("should not allow goal creation without a goal name", async () => {
  useAuthState.mockReturnValue([{ uid: "testUser123" }, false]);
  render(<GoalForm />);

  // Click submit without entering a goal name
  fireEvent.click(screen.getByText("Add Goal"));

  expect(addDoc).not.toHaveBeenCalled();
});

test("should handle Firestore errors gracefully", async () => {
  useAuthState.mockReturnValue([{ uid: "testUser123" }, false]);

  // Configure the error case
  collection.mockReturnValue(jest.fn());
  addDoc.mockRejectedValue(new Error("Firestore error"));

  // Spy on console.error to check that error is logged
  const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  render(<GoalForm />);

  fireEvent.change(screen.getByPlaceholderText("Goal Name"), {
    target: { value: "Test Goal" },
  });
  fireEvent.click(screen.getByText("Add Goal"));

  await waitFor(() => {
    expect(addDoc).toHaveBeenCalledTimes(1);
  });
  
  expect(errorSpy).toHaveBeenCalledWith("Error adding goal: ", expect.any(Error));
  errorSpy.mockRestore();
});

test("should render form inputs with correct initial values", () => {
  useAuthState.mockReturnValue([{ uid: "testUser123" }, false]);
  render(<GoalForm />);

  // Check that the input fields are rendered with empty/default values
  expect(screen.getByPlaceholderText("Goal Name")).toHaveValue("");
  expect(screen.getByPlaceholderText("Description")).toHaveValue("");
  expect(screen.getByPlaceholderText("Progress (%)")).toHaveValue(0);

  // Check that the "Add Goal" button is rendered
  expect(screen.getByRole("button", { name: /add goal/i })).toBeInTheDocument();
});

test("should not allow goal creation when user is not logged in", () => {
  // Simulate no user logged in
  useAuthState.mockReturnValue([null, false]);
  render(<GoalForm />);

  // Enter a goal name
  fireEvent.change(screen.getByPlaceholderText("Goal Name"), {
    target: { value: "Test Goal" },
  });
  fireEvent.click(screen.getByText("Add Goal"));

  // Since no user is logged in, addDoc should not be called
  expect(addDoc).not.toHaveBeenCalled();
});

