// 모두의 공간
import React from "react";
import { Routes, Route } from "react-router-dom";
import SignupLoginMainPage from "../pages/auth/SignupLoginMainPage";
import SignupPage from "../pages/auth/SignupPage";
import LoginPage from "../pages/auth/LoginPage";
import MainRoutes from "./MainRoutes";
import MultiRoutes from "./MultiRoutes";
import SingleRoutes from "./SingleRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      {/* 인증 관련 페이지 */}
      <Route path="/" element={<SignupLoginMainPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* 메인, 멀티, 싱글 라우트 분리 */}
      <Route path="/main/*" element={<MainRoutes />} />
      <Route path="/multi/*" element={<MultiRoutes />} />
      <Route path="/single/*" element={<SingleRoutes />} />
    </Routes>
  );
};

export default AppRoutes;
