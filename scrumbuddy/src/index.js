// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App"; // Updated the path to point to the components folder

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
