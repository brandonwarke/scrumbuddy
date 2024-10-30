import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import "./NavigationBar.css";

const NavigationBar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully");
      navigate("/login"); // Redirect to login or home page after logout
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <div className="navigation-bar">
      <h2>ScrumBuddy</h2>
      <ul>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/tasks">Tasks</Link>
        </li>
        <li>
          <Link to="/goals">Goals</Link>
        </li>
        {/* Add more links as needed */}
      </ul>
      <button onClick={handleLogout} className="logout-button">
        Log Out
      </button>
    </div>
  );
};

export default NavigationBar;
