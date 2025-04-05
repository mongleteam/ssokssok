// src/components/CustomConfirm.jsx
import React from "react";

const CustomConfirm = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl shadow-lg text-center">
      <p className="mb-6 text-3xl font-dodam">{message}</p>
      <div className="flex justify-center gap-4">
        <button
          onClick={onConfirm}
          className="bg-red-500 hover:bg-red-600 text-2xl text-white px-4 py-2 rounded font-dodam"
        >
          확인
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-400 hover:bg-gray-500 text-2xl text-white px-4 py-2 rounded font-dodam"
        >
          취소
        </button>
      </div>
    </div>
  </div>
);

export default CustomConfirm;
