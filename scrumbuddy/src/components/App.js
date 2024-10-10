// src/components/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Auth from "./Auth";
import Home from "./Home";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        {/* If user is logged in, navigate to home page, else show login/signup */}
        <Route path="/" element={user ? <Navigate to="/home" /> : <Auth />} />
        {/* Home page route for logged-in users */}
        <Route path="/home" element={user ? <Home /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;