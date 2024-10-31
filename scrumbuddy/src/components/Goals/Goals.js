import React from "react";
import GoalForm from "./GoalForm";
import "./Goals.css";

const Goals = () => {
  return (
    <div className="goals-container">
      <h2>Create Goals</h2>
      <GoalForm />
    </div>
  );
};

export default Goals;
