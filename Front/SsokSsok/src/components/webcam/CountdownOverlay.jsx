import React from "react";

const CountdownOverlay = ({ count }) => {
  return (
    <div className="absolute inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40">
      <div className="text-white text-8xl font-bold animate-pulse">{count}</div>
    </div>
  );
};

export default CountdownOverlay;
