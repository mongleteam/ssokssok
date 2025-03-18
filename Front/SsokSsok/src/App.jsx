import React from "react";
import SignupLoginMainPage from "./pages/auth/SignupLoginMainPage"
import SignupPage from "./pages/auth/SignupPage"
import LoginPage from "./pages/auth/loginPage"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import MainPage from "./pages/main/MainPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignupLoginMainPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/main" element={<MainPage />} />
      </Routes>
    </Router>
  );
}

export default App;
