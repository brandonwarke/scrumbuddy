import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import "./Goals.css";

const EditGoal = () => {
  const { id } = useParams(); // Get goal ID from URL
  const location = useLocation(); // Get state from navigate
  const navigate = useNavigate();

  const [goal, setGoal] = useState(location.state?.goal || null); // Check for state

  useEffect(() => {
    const fetchGoalFromFirestore = async () => {
      if (!goal) {
        console.log("Fetching goal from Firestore...");
        try {
          const goalDoc = doc(db, "goals", id);
          const docSnap = await getDoc(goalDoc);
          if (docSnap.exists()) {
            setGoal({ id: docSnap.id, ...docSnap.data() });
          } else {
            console.error("Goal not found!");
            navigate("/dashboard");
          }
        } catch (error) {
          console.error("Error fetching goal:", error);
          navigate("/dashboard");
        }
      }
    };

    fetchGoalFromFirestore();
  }, [goal, id, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "goals", goal.id), {
        goalName: goal.goalName,
        description: goal.description,
        progress: goal.progress,
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  if (!goal) return <p>Loading...</p>;

  return (
    <form className="goal-form" onSubmit={handleUpdate}>
      <h2>Edit Goal</h2>
      <label>
        Goal Name:
        <input
          type="text"
          value={goal.goalName}
          onChange={(e) => setGoal({ ...goal, goalName: e.target.value })}
          required
        />
      </label>
      <label>
        Description:
        <textarea
          value={goal.description}
          onChange={(e) => setGoal({ ...goal, description: e.target.value })}
        />
      </label>
      <label>
        Progress:
        <input
          type="number"
          value={goal.progress}
          onChange={(e) => setGoal({ ...goal, progress: Number(e.target.value) })}
          min="0"
          max="100"
        />
      </label>
      <button type="submit">Update Goal</button>
    </form>
  );
};

export default EditGoal;
