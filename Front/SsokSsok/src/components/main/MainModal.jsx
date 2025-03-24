// src/components/common/MainModal.jsx

import React from "react";
import { motion } from "framer-motion";
import modalBackground from "../../assets/images/main_modal_img.png";
import closeButton from "../../assets/images/remove_icon.png";

const MainModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative w-[55rem] max-w-[95vw]"
      >
        {/* 모달 배경 이미지 */}
        <img src={modalBackground} alt="Modal Background" className="w-full" />

        {/* 닫기 버튼 */}
        <button onClick={onClose} className="absolute top-5 right-8 z-10">
          <img src={closeButton} alt="Close" className="w-11 h-10" />
        </button>

        {/* 자식 컴포넌트 (내용) */}
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default MainModal;
