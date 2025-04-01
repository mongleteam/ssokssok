import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import backgroundImage from "../../assets/images/hint_modal_background.png";
import closeButton from "../../assets/images/remove_icon.png";
import saveButtonImg from "../../assets/images/btn_green.png"; // ✅ 저장 버튼 이미지 추가

const PhotoCaptureModal = ({ isOpen, previewUrl, onSave, onClose, duration = 10000 }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center z-[9999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* 배경 */}
            <img src={backgroundImage} alt="배경" className="w-[62rem]" />

            {/* 닫기 버튼 */}
            <button onClick={onClose} className="absolute top-12 right-14">
              <img src={closeButton} alt="닫기" className="w-11 h-11" />
            </button>

            {/* 콘텐츠 */}
            <div className="absolute w-[80%] h-[70%] flex items-center justify-center flex-col gap-4">
              <h2 className="text-4xl font-bold text-black text-center font-cafe24">기록 완료!</h2>

              {/* 캡처 이미지 */}
              <img
                src={previewUrl}
                alt="캡처 미리보기"
                className="w-[36rem] rounded-xl border-4 border-white shadow-xl"
              />

              <p className="text-2xl font-bold text-black font-cafe24">내 사진책에서 볼 수 있어요!</p>

              {/* 저장 버튼 이미지 */}
              <button onClick={onSave} className="relative w-52 mt-2 hover:scale-105 transition">
                <img src={saveButtonImg} alt="저장" className="w-full" />
                <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-cafe24">
                  저장하기
                </span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PhotoCaptureModal;
