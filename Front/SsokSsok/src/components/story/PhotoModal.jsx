import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import hintModalBackground from "../../assets/images/hint_modal_background.png"  // hint 배경 이미지
import hintPhotoImage from "../../assets/images/hint_photo.png"
import closeButton from "../../assets/images/remove_icon.png"; // 닫기 버튼 이미지


const PhotoModal = ({ isOpen, onClose, children, duration = 10000 }) => {
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
                    className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center z-50"
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
                        {/* 모달 배경 이미지 */}
                        <img src={hintModalBackground} alt="Modal Background" className="w-[55rem]" />

                        {/* 닫기 버튼 */}
                        <button onClick={onClose} className="absolute top-10 right-12">
                            <img src={closeButton} alt="Close" className="w-11 h-10" />
                        </button>

                        {/* 모달 내용 */}
                        <div className="absolute w-[80%] h-[70%] flex items-center justify-center flex-col gap-4">
                            {/* 제목 텍스트 추가 */}
                            <h2 className="text-4xl font-bold text-black text-center mt-6 font-cafe24">나의 모습을 기록하고 싶다면?</h2>

                            {/* hint_photo 이미지 고정으로 포함 */}
                            <img src={hintPhotoImage} alt="포토힌트 이미지" className="w-[30rem]" />

                            {/* children: 텍스트나 버튼 등 외부에서 넘길 수 있는 영역역 */}

                            {children && children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PhotoModal;