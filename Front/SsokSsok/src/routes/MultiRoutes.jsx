import React from "react";
import { Routes, Route } from "react-router-dom";
import MultiPage from "../pages/multi/MultiPage";

const MultiRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MultiPage />} />
      
    </Routes>
  );
};

export default MultiRoutes;
