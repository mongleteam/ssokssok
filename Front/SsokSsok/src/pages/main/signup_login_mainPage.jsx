import React from "react";
import logoImg from "../../assets/images/SsokSsok_logo_hp.png";
import "../../styles/main_background.css";

const SignupLoginMain = () => {
    return (
      <div className="background-container">
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
            {/* 쏙쏙 로고 */}
            <img src={logoImg} alt="logo" className="w-90 mb-6"/>
        </div>
      </div>
    );
  };

export default SignupLoginMain;