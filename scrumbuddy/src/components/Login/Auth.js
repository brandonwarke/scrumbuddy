import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
  const navigate = useNavigate(); // Use useNavigate to handle redirection

  const handleSignIn = async (e) => {
    e.preventDefault();
    await signInWithEmailAndPassword(email, password);
  };

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      {error && <p className="error">{error.message}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSignIn}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Sign In</button>
        </form>
      )}
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default Auth;
