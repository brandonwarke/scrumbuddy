import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const CalendarEventForm = () => {
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [user] = useAuthState(auth); // Get the logged-in user

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!eventName) {
      console.error("Event name is required");
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
      userId: user.uid, // Associate the event with the logged-in user
      createdAt: new Date(),
    };

    try {
      const docRef = await addDoc(collection(db, "calendarEvents"), newEvent);
      console.log("Event added with ID: ", docRef.id);

      // Clear form fields
      setEventName("");
      setDate("");
      setTime("");
    } catch (e) {
      console.error("Error adding event: ", e);
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
      <button type="submit">Add Event</button>
    </form>
  );
};

export default CalendarEventForm;
