import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
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
import "./Dashboard.css";

const generateRecurringEvents = (events) => {
  const today = new Date();
  const endDate = new Date();
  endDate.setDate(today.getDate() + 7); // Only display the next 7 days

  const expandedEvents = [];

  events.forEach((event) => {
    const eventDate = new Date(event.start); // Use `start` field as the base date

    while (eventDate <= endDate) {
      expandedEvents.push({
        ...event,
        start: eventDate.toISOString(), // Use ISO format for FullCalendar
      });

      // Handle recurrence
      if (event.recurrence === "daily") {
        eventDate.setDate(eventDate.getDate() + 1);
      } else if (event.recurrence === "weekly") {
        eventDate.setDate(eventDate.getDate() + 7);
      } else if (event.recurrence === "biweekly") {
        eventDate.setDate(eventDate.getDate() + 14);
      } else if (event.recurrence === "monthly") {
        eventDate.setMonth(eventDate.getMonth() + 1);
      } else {
        break; // No recurrence
      }
    }
  });

  return expandedEvents;
};

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [goals, setGoals] = useState([]);
  const [events, setEvents] = useState([]);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

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
      const tasksArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksArray);
    });

    const goalsQuery = query(collection(db, "goals"), where("userId", "==", user.uid));
    const unsubscribeGoals = onSnapshot(goalsQuery, (querySnapshot) => {
      const goalsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGoals(goalsArray);
    });

    const eventsQuery = query(
      collection(db, "calendarEvents"),
      where("userId", "==", user.uid)
    );

    const unsubscribeEvents = onSnapshot(eventsQuery, (querySnapshot) => {
      const fetchedEvents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().eventName,
        start: doc.data().date + "T" + doc.data().time,
        recurrence: doc.data().recurrence,
      }));

      setEvents(generateRecurringEvents(fetchedEvents));
    });

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

  const handleEventClick = (info) => {
    const clickedEvent = {
      id: info.event.id,
      title: info.event.title,
      start: info.event.start.toISOString(),
      recurrence: info.event.extendedProps.recurrence,
    };

    navigate("/edit-event", { state: { event: clickedEvent } });
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
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek" // Weekly view
          events={events}
          allDaySlot={false} // Disable all-day slot
          headerToolbar={{
            left: "",
            center: "title",
            right: "",
          }}
          height={500} // Calendar height
          firstDay={1} // Start week on Monday
          hiddenDays={[6, 0]} // Hide Saturday and Sunday
          eventClick={handleEventClick}
        />
      </div>
    </div>
  );
};

export default Dashboard;
