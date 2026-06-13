import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AuthProvider from "../context/AuthContext";
import "../index.css";
import "./App.css";

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import "@mantine/core/styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="light">
      <Notifications   styles={{
        notification: {
          maxWidth: 350,
          width: "350px",
          position:'absolute',
        }
      }} />
      <AuthProvider>
        <App />
      </AuthProvider>
    </MantineProvider>
  </React.StrictMode>
);