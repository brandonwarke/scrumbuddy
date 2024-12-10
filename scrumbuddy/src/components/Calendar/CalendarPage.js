import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import CalendarEventForm from './CalendarEventForm';
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [user] = useAuthState(auth); // Get the logged-in user

  // Fetch events from Firestore
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
      setEvents(fetchedEvents);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Scrum Calendar</h1>
      <CalendarEventForm />
      <Calendar onChange={setSelectedDate} value={selectedDate} />
      <h2>Scheduled Events</h2>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <strong>{event.eventName}</strong>: {event.date} at {event.time}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CalendarPage;
