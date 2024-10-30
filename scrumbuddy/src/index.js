import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App/App";  // Correct path for App
import "./styles/index.css"; // Correct path for index.css

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
