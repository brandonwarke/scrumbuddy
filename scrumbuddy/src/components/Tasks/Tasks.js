// src/components/Tasks/Tasks.js
import React from "react";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import "./Tasks.css";

const Tasks = () => {
  return (
    <div className="tasks-container">
      <h2>Tasks / To-Do List</h2>
      <TaskForm />
      <TaskList />
    </div>
  );
};

export default Tasks;
