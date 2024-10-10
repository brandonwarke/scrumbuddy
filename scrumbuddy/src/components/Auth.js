// src/components/Auth.js
import React, { useState } from "react";
import { auth } from "../firebase"; // Updated import path
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        // Sign up new user
        await createUserWithEmailAndPassword(auth, email, password);
        alert("User signed up successfully");
      } else {
        // Sign in existing user
        await signInWithEmailAndPassword(auth, email, password);
        alert("User signed in successfully");
      }
    } catch (error) {
      console.error("Error during authentication:", error.message);
      alert(error.message);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">{isSignUp ? "Sign Up" : "Sign In"}</button>
      </form>
      <button onClick={() => setIsSignUp(!isSignUp)}>
        Switch to {isSignUp ? "Sign In" : "Sign Up"}
      </button>
    </div>
  );
};

export default Auth;
