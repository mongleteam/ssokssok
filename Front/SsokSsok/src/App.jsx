import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom"
import AppRoutes from "./routes";
import useAuthStore from "./stores/authStore";
import useAlarmSSE from "./hooks/useAlarmSSE";

const App = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  useAlarmSSE(accessToken);
  return (
    <Router>
      <AppRoutes/>
    </Router>
  );
}

export default App;
