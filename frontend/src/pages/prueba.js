import React from "react";
import { ThemeProvider } from "@material-tailwind/react"; // Add ThemeProvider if this file is standalone
import { ElevatorSidebar } from "../components/Sidebar";

function Prueba() {
  return (
    <ThemeProvider>
      <div style={{ display: "flex", height: "100vh" }}>
        <ElevatorSidebar />
      </div>
    </ThemeProvider>
  );
}

export default Prueba;
