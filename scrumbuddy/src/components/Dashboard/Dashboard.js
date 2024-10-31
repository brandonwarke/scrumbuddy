import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Dashboard.css";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (!user) return;

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const datesOfInterest = [
      today.toISOString().split("T")[0],
      tomorrow.toISOString().split("T")[0],
    ];

    const q = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid),
      where("dueDate", "in", datesOfInterest)
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

  const markAsDone = async (taskId) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
      console.log("Task successfully deleted!");
    } catch (e) {
      console.error("Error deleting task: ", e);
    }
  };

  const todayTasks = tasks.filter(
    (task) => task.dueDate === new Date().toISOString().split("T")[0]
  );

  const tomorrowTasks = tasks.filter(
    (task) =>
      task.dueDate ===
      new Date(new Date().setDate(new Date().getDate() + 1))
        .toISOString()
        .split("T")[0]
  );

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <div className="tasks-box">
        <h3>Tasks for the Next 2 Days</h3>
        
        <div className="tasks-day-section">
          <h4>Today</h4>
          {todayTasks.length === 0 ? (
            <p>No tasks for today.</p>
          ) : (
            todayTasks.map((task) => (
              <div key={task.id} className="task-item">
                <h5>{task.taskName}</h5>
                <p>{task.description}</p>
                <p>Priority: {task.priority}</p>
                <button onClick={() => markAsDone(task.id)}>Mark as Done</button>
              </div>
            ))
          )}
        </div>

        <div className="tasks-day-section">
          <h4>Tomorrow</h4>
          {tomorrowTasks.length === 0 ? (
            <p>No tasks for tomorrow.</p>
          ) : (
            tomorrowTasks.map((task) => (
              <div key={task.id} className="task-item">
                <h5>{task.taskName}</h5>
                <p>{task.description}</p>
                <p>Priority: {task.priority}</p>
                <button onClick={() => markAsDone(task.id)}>Mark as Done</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
