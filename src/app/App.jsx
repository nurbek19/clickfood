import { useEffect } from "react";
import { Outlet } from "react-router";
import ErrorBoundary from "@app/providers/ErrorBoundary.jsx";
import WebApp from "@twa-dev/sdk";
import { useTelegramBackButton } from "@shared/hooks/useTelegramBackButton";

function App() {
  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
  }, []);

  useTelegramBackButton();

  return (
    <div>
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </div>
  );
}

export default App;
