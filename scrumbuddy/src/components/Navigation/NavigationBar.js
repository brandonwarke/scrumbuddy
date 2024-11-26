// src/components/Navigation/NavigationBar.js
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import "./NavigationBar.css";

const NavigationBar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut(); // Log out the user
      navigate("/login"); // Redirect to the login page
    } catch (error) {
      console.error("Error during logout: ", error);
    }
  };

  return (
    <nav className="navigation-bar">
      <ul className="navigation-links">
        <li>
          <NavLink exact to="/dashboard" activeClassName="active">
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/tasks" activeClassName="active">
            Tasks
          </NavLink>
        </li>
        <li>
          <NavLink to="/goals" activeClassName="active">
            Goals
          </NavLink>
        </li>
        <li>
          <button className="logout-link" onClick={handleLogout}>
            Log Out
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default NavigationBar;
