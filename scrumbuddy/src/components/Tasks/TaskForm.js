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
  const [user] = useAuthState(auth); // Get the logged-in user

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the form from refreshing

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
      userId: user.uid, // Associate the task with the logged-in user
      createdAt: new Date(),
    };

    try {
      // Add the task to Firestore
      const docRef = await addDoc(collection(db, "tasks"), newTask);
      console.log("Document written with ID: ", docRef.id);

      // Clear the form fields after successful submission
      setTaskName("");
      setDescription("");
      setDueDate("");
      setPriority("Medium");
    } catch (e) {
      console.error("Error adding document: ", e);
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
    </form>
  );
};

export default TaskForm;
