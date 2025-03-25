import React from "react";

const PageNavigationButton = ({ icon, altText, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-12 h-12 flex items-center justify-center bg-transparent hover:scale-110 transition-transform"
    >
      <img src={icon} alt={altText} className="w-full h-full" />
    </button>
  );
};

export default PageNavigationButton;
