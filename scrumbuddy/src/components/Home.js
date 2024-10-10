// src/components/Home.js
import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out successfully");
        navigate("/"); // Redirect to login after logging out
      })
      .catch((error) => {
        console.error("Error signing out:", error.message);
      });
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Welcome to ScrumBuddy!</h1>
      <p>You are successfully logged in.</p>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default Home;