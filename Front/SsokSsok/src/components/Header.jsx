import React, { useState } from "react";
import mybookIcon from "../assets/images/mybook_icon.png";
import myPageIcon from "../assets/images/mypage_icon.png";
import alarmIcon from "../assets/images/alaram_icon_jong.png";
import settingsIcon from "../assets/images/settings_icon.png";
import SsokSsokLogo from "../assets/images/SsokSsok_logo.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MainModal from "./main/MainModal";
import MyPageModal from "./main/MyPageModal";
import AlarmModal from "./main/AlarmModal";
import SettingsModal from "./main/SettingsModal";

const Header = () => {
    const navigate = useNavigate();
    const [modalContent, setModalContent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 모달 열기
    const openModal = (Component) => {
        setModalContent(<Component />);
        setIsModalOpen(true);
    };

    return (
        <>
            <header className="absolute top-4 flex justify-between items-center w-full px-6 z-10">
                <div className="flex-shrink-0">
                    <motion.img
                        src={SsokSsokLogo}
                        alt="SsokSsokLogo"
                        className="w-[7rem] cursor-pointer" // 로고만 키우기
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        onClick={() => navigate("/main")}
                    />
                </div>

                <div className="flex gap-4">
                    <motion.img
                        src={mybookIcon}
                        alt="My Album"
                        className="w-[3.5rem] cursor-pointer"
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        onClick={() => navigate("/main/myalbum")}
                    />
                    <motion.img
                        src={myPageIcon}
                        alt="My Page"
                        className="w-[3.5rem] cursor-pointer"
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        onClick={() => openModal(MyPageModal)}
                    />
                    <motion.img
                        src={alarmIcon}
                        alt="Alarm"
                        className="w-[3.5rem] cursor-pointer"
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        onClick={() => openModal(AlarmModal)}
                    />
                    <motion.img
                        src={settingsIcon}
                        alt="Settings"
                        className="w-[3.5rem] cursor-pointer"
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        onClick={() => openModal(SettingsModal)}
                    />
                </div>
            </header>

            <MainModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {modalContent}
            </MainModal>
        </>
    );
};

export default Header;
