// src/components/Goals/GoalForm.js
import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
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

    const newGoal = {
      goalName,
      description,
      progress,
      userId: user.uid,
      createdAt: new Date(),
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