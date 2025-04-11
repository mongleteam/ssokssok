import React, { useEffect } from "react";

function PageAlert({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 1500); // 2초 후 자동 닫힘
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 bg-white border border-gray-300 shadow-md rounded-xl px-6 py-3 text-gray-800 text-lg font-semibold font-cafe24 animate-fade-in">
      {message}
    </div>
  );
}

export default PageAlert;
