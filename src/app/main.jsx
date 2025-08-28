import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import WebApp from "@twa-dev/sdk";

import { RouterProvider } from "react-router";
import router from "@app/router.jsx";

import "./index.css";
import "@app/App.css";

WebApp.ready();

// Router is defined in @app/router.jsx with lazy-loaded routes

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
