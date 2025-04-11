// src/pages/MagicStarPage.jsx
import React from "react";
import MagicCircleMission from "../components/missions/MagicCircleMisson"; // 경로에 맞게 조정해줘
import MagicStar from "../assets/images/magic_star.png"
const MagicStarPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf2e9]">
      <MagicCircleMission
    backgroundImage={MagicStar}
    onComplete={() => alert('⭐ 미션 성공!')}
    />
    </div>
  );
};

export default MagicStarPage;
