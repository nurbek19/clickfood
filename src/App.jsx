import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import WebApp from '@twa-dev/sdk';


function App() {
  useEffect(() => {
    WebApp.expand();
  }, []);

  return (
    <div>
      <Outlet />
    </div>
  )
}

export default App
