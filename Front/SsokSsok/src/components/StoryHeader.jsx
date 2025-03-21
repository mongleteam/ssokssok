import React, { useState } from 'react';
import SettingsModal from './main/SettingsModal';
import settingsIcon from "../assets/images/settings_icon.png";
import { motion } from "framer-motion";
import MainModal from "./main/MainModal";

const StoryHeader = () => {
    const [modalContent, setModalContent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 모달 열기
    const openModal = (Component) => {
        setModalContent(<Component />);
        setIsModalOpen(true);
    };

    return (
        <>
        <header className="absolute top-4 right-0 flex justify-end items-center w-full px-6 z-10">
                <motion.img
                    src={settingsIcon}
                    alt="Settings"
                    className="w-[3.5rem] cursor-pointer"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={() => openModal(SettingsModal)}
                />
        </header>

        <MainModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {modalContent}
        </MainModal>
        
        </>
    )
}

export default StoryHeader