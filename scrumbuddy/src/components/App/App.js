// src/components/App/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navigation from "../Navigation/NavigationBar";
import Header from "../Header/Header";
import Dashboard from "../Dashboard/Dashboard";
import Tasks from "../Tasks/Tasks";
import Auth from "../Login/Auth"; // Make sure to import the Auth component correctly
import "./App.css"; // Import the styles for the main layout
import NavigationBar from "../Navigation/NavigationBar";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <NavigationBar />
        <div className="main-content">
          <Header />
          <div className="page-content">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/login" element={<Auth />} /> {/* Ensure Auth is imported */}
              <Route path="/" element={<Dashboard />} />
              {/* Add more routes here as needed */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
