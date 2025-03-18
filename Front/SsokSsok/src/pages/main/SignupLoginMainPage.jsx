import React from "react";
import { motion } from "framer-motion";
import logoImg from "../../assets/images/logo.png";
import underLogoImg from "../../assets/images/main_under_logo.png";
import signupImg from "../../assets/images/login_page_two.png";
import "../../styles/main_background.css";
import BeeAnimation from "../../components/animations/BeeAnimation";
import FlowerAnimation from "../../components/animations/FlowerAnimation";
import { useNavigate } from "react-router-dom";

const SignupLoginMain = () => {
    const navigate = useNavigate()
    return (
      <>
        {/* 벌이 화면 전체를 날아다니도록 background-container 밖에서 배치 */}
        <BeeAnimation />
        <FlowerAnimation/>
        <div className="background-container relative">
          <div className="relative z-10 flex flex-col items-center -translate-y-24">
              {/* 쏙쏙 로고 */}
              <motion.img 
                  src={logoImg} 
                  alt="logo" 
                  className="w-[18rem]"
                  initial={{ y: -60, rotate: 0 }}
                  animate={{ rotate: [0, 2, -2, 2, -2, 0] }} 
                  transition={{ repeat: Infinity, duration: 2 }}
              />
              <div className="relative -translate-y-12">
                  {/* 로고 밑에 이미지 이야기 속으로 쏙 */}
                  <img src={underLogoImg} alt="under_logo_img" className="w-[35rem]"/>

                  <div className="absolute left-1/2 -translate-x-1/2 -bottom-[16rem] z-[-1]">
                      {/* 회원가입 로그인 버튼 */}
                      <img src={signupImg} alt="signup, login button" className="w-[19rem]"/>
                      {/* 회원가입 버튼 */}
                      <button className="absolute top-[37%] left-1/2 -translate-x-1/2 font-ganpan text-black text-3xl"
                            onClick={() => navigate("/signup")}>
                          회원가입
                      </button>

                      {/* 로그인 버튼 */}
                      <button className="absolute top-[72%] left-1/2 -translate-x-1/2 font-ganpan text-black text-3xl"
                            onClick={() => navigate("/login")}>
                          로그인
                      </button>
                  </div>
              </div>
          </div>
        </div>
      </>
    );
};

export default SignupLoginMain;
