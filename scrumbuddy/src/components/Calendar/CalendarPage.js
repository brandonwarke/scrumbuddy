import React, { useEffect } from 'react';
import CalendarEventForm from './CalendarEventForm';
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const CalendarPage = () => {
  const [user] = useAuthState(auth); // Get the logged-in user

  // Fetch events from Firestore (logic retained for potential future use)
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "calendarEvents"),
      where("userId", "==", user.uid) // Only fetch the current user's events
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // You can fetch and process events here if needed in the future
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Scrum Calendar</h1>
      <CalendarEventForm />
      {/* Calendar and scheduled events removed */}
    </div>
  );
};

export default CalendarPage;