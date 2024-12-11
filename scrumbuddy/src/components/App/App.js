// src/components/App/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavigationBar from "../Navigation/NavigationBar";
import Header from "../Header/Header";
import Dashboard from "../Dashboard/Dashboard";
import Tasks from "../Tasks/Tasks";
import GoalForm from "../Goals/GoalForm";
import Auth from "../Login/Auth";
import SignUp from "../Login/SignUp"; // Make sure to import the SignUp component
import EditGoal from "../Goals/EditGoal";
import CalendarPage from '../Calendar/CalendarPage';
import EditEventPage from "../Calendar/EditEventPage";

import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <NavigationBar />
                <div className="main-content">
                  <Header />
                  <div className="page-content">
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/tasks" element={<Tasks />} />
                      <Route path="/goals" element={<GoalForm />} />
                      <Route path="/goals/edit/:id" element={<EditGoal />} />
                      <Route path="/edit-event" element={<EditEventPage />} />

                      <Route path="/calendar" element={<CalendarPage />} />
                      <Route path="/" element={<Dashboard />} />
                    </Routes>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;