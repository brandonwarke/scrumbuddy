import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const CalendarEventForm = () => {
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [recurrence, setRecurrence] = useState("none"); // Recurrence state
  const [user] = useAuthState(auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!eventName || !date || !time) {
      console.error("Event name, date, and time are required");
      return;
    }

    if (!user) {
      console.error("User is not logged in");
      return;
    }

    const newEvent = {
      eventName,
      date,
      time,
      recurrence, // Add recurrence type
      userId: user.uid,
      createdAt: new Date(),
    };

    try {
      await addDoc(collection(db, "calendarEvents"), newEvent);
      console.log("Event added:", newEvent);

      // Clear form
      setEventName("");
      setDate("");
      setTime("");
      setRecurrence("none");
    } catch (e) {
      console.error("Error adding event:", e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Event Name"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
      />
      <select value={recurrence} onChange={(e) => setRecurrence(e.target.value)}>
        <option value="none">No Recurrence</option>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="biweekly">Bi-Weekly</option>
        <option value="monthly">Monthly</option>
      </select>
      <button type="submit">Add Event</button>
    </form>
  );
};

export default CalendarEventForm;
