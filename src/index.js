import React from "react";
import { createRoot } from "react-dom/client";
import App from "./client/pages/App.jsx";

const root = createRoot(document.getElementById("root"));
root.render(<App />);
