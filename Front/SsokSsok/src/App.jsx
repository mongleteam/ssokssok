import React from "react";
import SignupLoginMainPage from "./pages/auth/SignupLoginMainPage"
import SignupPage from "./pages/auth/SignupPage"
import LoginPage from "./pages/auth/LoginPage"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import MainPage from "./pages/main/MainPage";
import AppRoutes from "./routes";

function App() {
  return (
    <Router>
      <AppRoutes/>
    </Router>
  );
}

export default App;
