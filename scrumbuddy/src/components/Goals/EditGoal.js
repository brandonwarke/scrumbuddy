// src/components/Goals/EditGoal.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import "./Goals.css";

const EditGoal = () => {
  const { id } = useParams();
  const [goal, setGoal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGoal = async () => {
      const goalRef = doc(db, "goals", id);
      const goalSnap = await getDoc(goalRef);

      if (goalSnap.exists()) {
        setGoal(goalSnap.data());
      } else {
        console.log("No such goal!");
      }
    };

    fetchGoal();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await updateDoc(doc(db, "goals", id), {
        goalName: goal.goalName,
        description: goal.description,
        progress: goal.progress,
      });
      navigate("/dashboard");
    } catch (e) {
      console.error("Error updating goal: ", e);
    }
  };

  if (!goal) return <p>Loading...</p>;

  return (
    <form className="goal-form" onSubmit={handleUpdate}>
      <input
        type="text"
        value={goal.goalName}
        onChange={(e) => setGoal({ ...goal, goalName: e.target.value })}
        required
      />
      <textarea
        value={goal.description}
        onChange={(e) => setGoal({ ...goal, description: e.target.value })}
      />
      <input
        type="number"
        value={goal.progress}
        onChange={(e) => setGoal({ ...goal, progress: Number(e.target.value) })}
        min="0"
        max="100"
      />
      <button type="submit">Update Goal</button>
    </form>
  );
};

export default EditGoal;
