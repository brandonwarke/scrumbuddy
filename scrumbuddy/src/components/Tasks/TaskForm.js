import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Tasks.css";

const TaskForm = () => {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [error, setError] = useState(null);
  const [user] = useAuthState(auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!taskName) {
      console.error("Task name is required");
      return;
    }

    if (!user) {
      console.error("User is not logged in");
      return;
    }

    const newTask = {
      taskName,
      description,
      dueDate,
      priority,
      userId: user.uid,
      createdAt: new Date(),
    };

    try {
      const docRef = await addDoc(collection(db, "tasks"), newTask);
      console.log("Document written with ID: ", docRef.id);

      setTaskName("");
      setDescription("");
      setDueDate("");
      setPriority("Medium");
      setError(null);
    } catch (e) {
      console.error("Error adding document: ", e);
      setError(e);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task Name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <button type="submit">Add Task</button>
      {error && (
        <div role="alert" aria-label="Error adding document:">
          Error adding document: {error.message}
        </div>
      )}
    </form>
  );
};

export default TaskForm;
