import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";

const EditEventPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.event;

  // State to manage editable inputs
  const [eventName, setEventName] = useState(event?.title || "");
  const [eventDate, setEventDate] = useState(event?.start.split("T")[0] || "");
  const [eventTime, setEventTime] = useState(event?.start.split("T")[1] || "");

  const handleSave = async () => {
    if (!event) return;

    try {
      const eventRef = doc(db, "calendarEvents", event.id);
      await updateDoc(eventRef, {
        eventName,
        date: eventDate,
        time: eventTime,
      });
      alert("Event updated successfully!");
      navigate("/dashboard"); // Navigate back to the dashboard
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event.");
    }
  };

  const handleDelete = async () => {
    if (!event) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (!confirmDelete) return;

    try {
      const eventRef = doc(db, "calendarEvents", event.id);
      await deleteDoc(eventRef);
      alert("Event deleted successfully!");
      navigate("/dashboard"); // Navigate back to the dashboard
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event.");
    }
  };

  return (
    <div>
      <h1>Edit Event</h1>
      <div>
        <label>
          <strong>Event:</strong>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          <strong>Date:</strong>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          <strong>Time:</strong>
          <input
            type="time"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
          />
        </label>
      </div>
      <button onClick={handleSave}>Save</button>
      <button onClick={handleDelete} style={{ marginLeft: "10px" }}>
        Delete
      </button>
    </div>
  );
};

export default EditEventPage;
