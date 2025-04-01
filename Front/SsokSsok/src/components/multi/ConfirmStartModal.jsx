import React from "react";
import waitingBoard from "../../assets/images/waiting_board_img.png";
import { motion } from "framer-motion";

const ConfirmStartModal = ({ onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="relative w-[46rem] h-[28rem] bg-cover bg-center flex flex-col items-center justify-center"
        style={{ backgroundImage: `url(${waitingBoard})` }}
      >
        <h2 className="text-4xl text-white font-whitechalk drop-shadow-xl mb-4">
          상대방이 초대를 수락했어요!
        </h2>
        <p className="text-2xl text-white font-whitechalk drop-shadow-md mb-8">
          이제 함께 동화를 시작해볼까요?
        </p>
        <button
          onClick={onConfirm}
          className="bg-yellow-400 hover:bg-yellow-300 text-2xl font-bold py-2 px-8 rounded-xl font-whitechalk shadow-md"
        >
          시작하기
        </button>
      </motion.div>
    </div>
  );
};

export default ConfirmStartModal;
