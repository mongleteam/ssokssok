import React from "react";
import { Routes, Route } from "react-router-dom";
import SignupLoginMainPage from "../pages/auth/SignupLoginMainPage";
import SignupPage from "../pages/auth/SignupPage";
import LoginPage from "../pages/auth/LoginPage";
import MainRoutes from "./MainRoutes";
import MultiRoutes from "./MultiRoutes";
import SingleRoutes from "./SingleRoutes";
import MagicStarPage from "../pages/MagicStarPage";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ✅ 로그인 안 해도 되는 공개 페이지 (로그인 상태면 리디렉션) */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <SignupLoginMainPage />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* 🔐 보호된 페이지들 (로그인 안 되어 있으면 /login으로) */}
      <Route
        path="/main/*"
        element={
          <ProtectedRoute>
            <MainRoutes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/multi/*"
        element={
          <ProtectedRoute>
            <MultiRoutes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/single/*"
        element={
          <ProtectedRoute>
            <SingleRoutes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/magicstar"
        element={
          <ProtectedRoute>
            <MagicStarPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
