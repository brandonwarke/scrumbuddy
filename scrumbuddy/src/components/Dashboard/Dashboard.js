import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";
import { useNavigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import "./Dashboard.css";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [goals, setGoals] = useState([]);
  const [events, setEvents] = useState([]);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    // Fetch tasks for today and tomorrow
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const datesOfInterest = [
      today.toISOString().split("T")[0],
      tomorrow.toISOString().split("T")[0],
    ];

    const tasksQuery = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid),
      where("dueDate", "in", datesOfInterest)
    );

    const unsubscribeTasks = onSnapshot(tasksQuery, (querySnapshot) => {
      const tasksArray = [];
      querySnapshot.forEach((doc) => {
        tasksArray.push({ id: doc.id, ...doc.data() });
      });
      setTasks(tasksArray);
    });

    // Fetch goals
    const goalsQuery = query(collection(db, "goals"), where("userId", "==", user.uid));
    const unsubscribeGoals = onSnapshot(goalsQuery, (querySnapshot) => {
      const goalsArray = [];
      querySnapshot.forEach((doc) => {
        goalsArray.push({ id: doc.id, ...doc.data() });
      });
      setGoals(goalsArray);
    });

    // Fetch events
    const eventsQuery = query(
      collection(db, "calendarEvents"),
      where("userId", "==", user.uid)
    );
    const unsubscribeEvents = onSnapshot(eventsQuery, (querySnapshot) => {
      const eventsArray = [];
      querySnapshot.forEach((doc) => {
        eventsArray.push({ id: doc.id, ...doc.data() });
      });
      setEvents(eventsArray);
    });

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeTasks();
      unsubscribeGoals();
      unsubscribeEvents();
    };
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

  const colors = ["#8884d8", "#82ca9d", "#ffc658"];

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const eventOnDate = events.find(
        (event) => new Date(event.date).toDateString() === date.toDateString()
      );
      return eventOnDate ? <span>{eventOnDate.eventName}</span> : null;
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>

      {/* Tasks Section */}
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

      {/* Goals Section */}
      <div className="goals-section">
        <h3>Your Goals Progress</h3>
        {goals.length === 0 ? (
          <p>No goals set.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={goals}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="goalName" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar
                dataKey="progress"
                onClick={(data) => navigate(`/goals/edit/${data.id}`)}
                style={{ cursor: "pointer" }}
              >
                {goals.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
                <LabelList dataKey="progress" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Calendar Section */}
      <div className="calendar-section">
        <h3>Scrum Calendar</h3>
        <Calendar tileContent={tileContent} />
      </div>
    </div>
  );
};

export default Dashboard;
