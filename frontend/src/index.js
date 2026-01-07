import React from "react";
import ReactDOM from "react-dom/client";

/** ✅ Ant Design base styles (must be before your css) */
import "antd/dist/reset.css";

import "bootstrap/dist/css/bootstrap.min.css";

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider } from "@material-tailwind/react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();
