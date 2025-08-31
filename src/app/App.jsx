import { useEffect } from "react";
import { Outlet } from "react-router";
import ErrorBoundary from "@app/providers/ErrorBoundary.jsx";
import WebApp from "@twa-dev/sdk";

function App() {
  useEffect(() => {
    WebApp.expand();
  }, []);

  return (
    <div>
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </div>
  );
}

export default App;
