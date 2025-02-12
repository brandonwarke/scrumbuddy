import { TextEncoder, TextDecoder } from "util";
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CalendarEventForm from "../CalendarEventForm";
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

test("should create a new event when form is submitted", async () => {
  // Set up a logged-in user
  useAuthState.mockReturnValue([{ uid: "testUser123" }, false]);

  // Configure Firestore mocks:
  collection.mockReturnValue(jest.fn());
  addDoc.mockResolvedValue({ id: "mockDocId" });

  render(<CalendarEventForm />);

  // Simulate user input
  fireEvent.change(screen.getByPlaceholderText("Event Name"), {
    target: { value: "Test Event" },
  });
  fireEvent.change(screen.getByPlaceholderText("Date"), {
    target: { value: "2025-02-20" },
  });
  fireEvent.change(screen.getByPlaceholderText("Time"), {
    target: { value: "12:00" },
  });
  // Change recurrence using the select element (role "combobox")
  fireEvent.change(screen.getByRole("combobox"), {
    target: { value: "weekly" },
  });

  // Submit the form
  fireEvent.click(screen.getByText("Add Event"));

  // Wait for the asynchronous call to complete
  await waitFor(() => {
    expect(addDoc).toHaveBeenCalledTimes(1);
  });

  expect(addDoc).toHaveBeenCalledWith(expect.any(Function), {
    eventName: "Test Event",
    date: "2025-02-20",
    time: "12:00",
    recurrence: "weekly",
    userId: "testUser123",
    createdAt: expect.any(Date),
  });
});

test("should not allow event creation without required fields", () => {
  // Set up a logged-in user
  useAuthState.mockReturnValue([{ uid: "testUser123" }, false]);
  render(<CalendarEventForm />);

  // Click submit without filling in required fields
  fireEvent.click(screen.getByText("Add Event"));

  // Expect that addDoc is not called
  expect(addDoc).not.toHaveBeenCalled();
});

test("should handle Firestore errors gracefully", async () => {
  useAuthState.mockReturnValue([{ uid: "testUser123" }, false]);

  // Configure the error case
  collection.mockReturnValue(jest.fn());
  addDoc.mockRejectedValue(new Error("Firestore error"));

  // Spy on console.error to capture the error log
  const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  render(<CalendarEventForm />);

  fireEvent.change(screen.getByPlaceholderText("Event Name"), {
    target: { value: "Test Event" },
  });
  fireEvent.change(screen.getByPlaceholderText("Date"), {
    target: { value: "2025-02-20" },
  });
  fireEvent.change(screen.getByPlaceholderText("Time"), {
    target: { value: "12:00" },
  });
  fireEvent.click(screen.getByText("Add Event"));

  await waitFor(() => {
    expect(addDoc).toHaveBeenCalledTimes(1);
  });

  expect(errorSpy).toHaveBeenCalledWith("Error adding event:", expect.any(Error));
  errorSpy.mockRestore();
});

test("should render form inputs with correct initial values", () => {
  useAuthState.mockReturnValue([{ uid: "testUser123" }, false]);
  render(<CalendarEventForm />);

  // Check that the input fields are rendered with empty/default values
  expect(screen.getByPlaceholderText("Event Name")).toHaveValue("");
  expect(screen.getByPlaceholderText("Date")).toHaveValue("");
  expect(screen.getByPlaceholderText("Time")).toHaveValue("");
  // Check that the select element (recurrence) has the default value "none"
  expect(screen.getByRole("combobox")).toHaveValue("none");

  // Check that the "Add Event" button is rendered
  expect(screen.getByRole("button", { name: /add event/i })).toBeInTheDocument();
});



test("should not allow event creation when user is not logged in", () => {
  // Simulate no user logged in
  useAuthState.mockReturnValue([null, false]);
  render(<CalendarEventForm />);

  // Enter an event name and other details
  fireEvent.change(screen.getByPlaceholderText("Event Name"), {
    target: { value: "Test Event" },
  });
  fireEvent.change(screen.getByPlaceholderText("Date"), {
    target: { value: "2025-02-20" },
  });
  fireEvent.change(screen.getByPlaceholderText("Time"), {
    target: { value: "12:00" },
  });
  fireEvent.change(screen.getByRole("combobox"), {
    target: { value: "monthly" },
  });
  fireEvent.click(screen.getByText("Add Event"));

  // Since no user is logged in, addDoc should not be called
  expect(addDoc).not.toHaveBeenCalled();
});
