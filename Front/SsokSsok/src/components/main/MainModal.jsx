import React from "react";
import { motion } from "framer-motion";
import modalBackground from "../../assets/images/main_modal_img.png"; 
import closeButton from "../../assets/images/remove_icon.png"; 

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative flex items-center justify-center"
      >
        {/* 모달 */}
        <img src={modalBackground} alt="Modal Background" className="w-[55rem]" />

        {/* 닫기 */}
        <button onClick={onClose} className="absolute top-5 right-8">
          <img src={closeButton} alt="Close" className="w-10 h-10" />
        </button>

        {/* 모달 내용 */}
        <div className="absolute w-[80%] h-[70%] flex items-center justify-center">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default Modal;
