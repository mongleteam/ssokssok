// PageNavigationButton.jsx
import React from "react";

const PageNavigationButton = ({ icon, altText, onClick, disabled, className = "" }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-24 h-24 flex items-center justify-center bg-transparent transition-transform ${disabled ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'} ${className}`}
    >
      <img src={icon} alt={altText} className="w-full h-full" />
    </button>
  );
};


export default PageNavigationButton;
