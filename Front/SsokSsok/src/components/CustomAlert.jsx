import React from "react";

const CustomAlert = ({ message, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl shadow-lg text-center">
      <p className="mb-4 text-3xl font-dodam">{message}</p>
      <button
        onClick={onClose}
        className="bg-blue-500 hover:bg-blue-600 text-2xl text-white px-4 py-2 rounded font-dodam"
      >
        확인
      </button>
    </div>
  </div>
);

export default CustomAlert;
