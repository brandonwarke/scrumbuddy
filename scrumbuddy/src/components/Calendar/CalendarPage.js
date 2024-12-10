import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import CalendarEventForm from './CalendarEventForm';
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const generateRecurringEvents = (events) => {
  const today = new Date();
  const endDate = new Date();
  endDate.setMonth(today.getMonth() + 3); // Show 3 months ahead

  const expandedEvents = [];

  events.forEach((event) => {
    const eventDate = new Date(event.date);

    while (eventDate <= endDate) {
      expandedEvents.push({
        ...event,
        date: eventDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
      });

      // Handle recurrence logic
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

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [user] = useAuthState(auth); // Get the logged-in user

  // Fetch events from Firestore and expand recurring events
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "calendarEvents"),
      where("userId", "==", user.uid) // Only fetch the current user's events
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedEvents = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const expandedEvents = generateRecurringEvents(fetchedEvents);
      setEvents(expandedEvents);
    });

    return () => unsubscribe();
  }, [user]);

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const eventOnDate = events.find(
        (event) => new Date(event.date).toDateString() === date.toDateString()
      );
      return eventOnDate ? <span>{eventOnDate.eventName}</span> : null;
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Scrum Calendar</h1>
      <CalendarEventForm />
      <Calendar 
        onChange={setSelectedDate} 
        value={selectedDate} 
        tileContent={tileContent} 
      />
      <h2>Scheduled Events</h2>
      <ul>
        {events.map((event, index) => (
          <li key={`${event.id}-${index}`}>
            <strong>{event.eventName}</strong>: {event.date} at {event.time}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CalendarPage;
