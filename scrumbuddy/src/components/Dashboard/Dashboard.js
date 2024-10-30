import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Dashboard.css";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [user] = useAuthState(auth); // Get the logged-in user

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksArray = [];
      querySnapshot.forEach((doc) => {
        tasksArray.push({ id: doc.id, ...doc.data() });
      });
      setTasks(tasksArray);
    });

    return () => unsubscribe();
  }, [user]);

  // Get current date and calculate next 7 days
  const today = new Date();
  const datesOfTheWeek = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    return date.toISOString().split("T")[0];
  });

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="tasks-section">
        <h3>Tasks for the Week Ahead</h3>
        {datesOfTheWeek.map((date) => (
          <div key={date} className="day-section">
            <h4>{date}</h4>
            {tasks.filter((task) => task.dueDate === date).length === 0 ? (
              <p>No tasks for this day.</p>
            ) : (
              tasks
                .filter((task) => task.dueDate === date)
                .map((task) => (
                  <div key={task.id} className="task-card">
                    <h5>{task.taskName}</h5>
                    <p>{task.description}</p>
                    <p>Priority: {task.priority}</p>
                  </div>
                ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
