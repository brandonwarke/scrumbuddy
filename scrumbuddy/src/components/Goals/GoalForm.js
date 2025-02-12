import React, { useState } from "react";
// Rename serverTimestamp on import so we can check if it exists.
import { collection, addDoc, serverTimestamp as realServerTimestamp } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Goals.css";

const GoalForm = () => {
  const [goalName, setGoalName] = useState("");
  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState(0);
  const [user] = useAuthState(auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!goalName) {
      console.error("Goal name is required");
      return;
    }

    if (!user) {
      console.error("User is not logged in");
      return;
    }

    // Helper to get a timestamp.
    const getTimestamp = () =>
      typeof realServerTimestamp === "function" ? realServerTimestamp() : new Date();

    const newGoal = {
      goalName,
      description,
      progress,
      status: progress === 100 ? "completed" : "in-progress",
      completedAt: progress === 100 ? getTimestamp() : null,
      userId: user.uid,
      createdAt: getTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, "goals"), newGoal);
      console.log("Goal added with ID: ", docRef.id);

      // Clear form fields
      setGoalName("");
      setDescription("");
      setProgress(0);
    } catch (e) {
      console.error("Error adding goal: ", e);
    }
  };

  return (
    <form className="goal-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Goal Name"
        value={goalName}
        onChange={(e) => setGoalName(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        placeholder="Progress (%)"
        value={progress}
        onChange={(e) => setProgress(Number(e.target.value))}
        min="0"
        max="100"
        required
      />
      <button type="submit">Add Goal</button>
    </form>
  );
};

export default GoalForm;
