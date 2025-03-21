// 싱글 나영언니 공간
import React from "react";
import { Routes, Route } from "react-router-dom";
import SinglePage from "../pages/single/SinglePage";

const SingleRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SinglePage />} />
    </Routes>
  );
};

export default SingleRoutes;
