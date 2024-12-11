import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";

const EditEventPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const event = state?.event;

  if (!event) {
    return <div>No event selected</div>;
  }

  const handleSave = async () => {
    try {
      const eventRef = doc(db, "calendarEvents", event.id);
      await updateDoc(eventRef, {
        eventName: event.title,
        date: event.start.split("T")[0],
        time: event.start.split("T")[1],
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const eventRef = doc(db, "calendarEvents", event.id);
      await deleteDoc(eventRef);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div>
      <h2>Edit Event</h2>
      <p>
        <strong>Event:</strong> {event.title}
      </p>
      <p>
        <strong>Date:</strong> {event.start.split("T")[0]}
      </p>
      <p>
        <strong>Time:</strong> {event.start.split("T")[1]}
      </p>
      <button onClick={handleSave}>Save</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default EditEventPage;
