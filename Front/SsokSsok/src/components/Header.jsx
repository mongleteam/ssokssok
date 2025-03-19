import React, { Component, useState } from "react";
import mybookIcon from "../assets/images/mybook_icon.png";
import myPageIcon from "../assets/images/mypage_icon.png";
import alarmIcon from "../assets/images/alaram_icon_jong.png";
import settingsIcon from "../assets/images/settings_icon.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MainModal from "./main/MainModal";
import MyPageModal from "./main/MyPageModal";
import AlarmModal from "./main/AlarmModal";
import SettingsModal from "./main/SettingsModal";


const Header = () => {
    const navigate = useNavigate()

    const [modalContent, setModalContent] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // 모달 열기
    const openModal = (Component) => {
        setModalContent(<Component/>)
        setIsModalOpen(true)
    }

    return (
        <>
        <header className="absolute top-4 right-6 flex gap-4 z-10">
            <motion.img
                src={mybookIcon}
                alt="My Album"
                className="w-[3.5rem] cursor-pointer"
                whileHover={{ scale: 1.15 }} 
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={() => {
                    console.log("Navigating to /myalbum");
                    navigate("/main/myalbum");
                }}
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
        </header>

        <MainModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalContent}
        </MainModal>       
    </>

    )
}

export default Header;
