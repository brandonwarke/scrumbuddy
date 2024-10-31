import React from "react";
import { NavLink } from "react-router-dom";
import { auth } from "../../firebase";
import "./NavigationBar.css";

const NavigationBar = () => {
  const handleLogout = () => {
    auth.signOut();
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
