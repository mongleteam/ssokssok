import React from "react";
import SignupLoginMainPage from "./pages/main/SignupLoginMainPage"
import SignupPage from "./pages/main/SignupPage"
import LoginPage from "./pages/main/LoginPage"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignupLoginMainPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
