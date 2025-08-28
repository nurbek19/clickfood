import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import WebApp from "@twa-dev/sdk";

import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App.jsx";
import { CreatePartner } from "../features/partner/pages/CreatePartner.jsx";
import { CreateMenu } from "../features/menu/pages/CreateMenu.jsx";
import { OrderPage } from "../features/order/pages/OrderPage.jsx";

import "./index.css";

WebApp.ready();

const router = createBrowserRouter([
  {
    path: "/clickfood/",
    element: <App />,
    children: [
      {
        path: "/clickfood/",
        element: <CreatePartner />,
      },
      {
        path: "/clickfood/foods",
        element: <CreateMenu />,
      },
      {
        path: "/clickfood/order",
        element: <OrderPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
