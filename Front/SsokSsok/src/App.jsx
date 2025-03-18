import React from "react";
import SingupLoginMainPage from "./pages/main/SignupLoginMainPage"
import SignupPage from "./pages/main/SignupPage"
import LoginPage from "./pages/main/LoginPage"

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
