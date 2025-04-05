import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom"
import AppRoutes from "./routes";
import useAuthStore from "./stores/authStore";
import useAlarmSSE from "./hooks/useAlarmSSE";
import useBgmStore from "./stores/bgmStore";
import './index.css';
const App = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  // App.jsx
  useEffect(() => {
    const start = () => {
      useBgmStore.getState().initBgm();
      window.removeEventListener("click", start);
    };
  
    window.addEventListener("click", start);
  
    return () => {
      window.removeEventListener("click", start);
    };
  }, []);

  useAlarmSSE(accessToken);
  return (
    <Router>
      <AppRoutes/>
    </Router>
  );
}

export default App;
