import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles/global.css";

import App from "./App";
import { seedDemoData } from "./utils/seedData";

seedDemoData();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);