import React from "react";
import BeeAnimation from "../../components/animations/BeeAnimation";
import FlowerAnimation from "../../components/animations/FlowerAnimation";
import LoginBoard from "../../assets/images/login_board_icon.png"
import "../../styles/auth/signup_input_container.css";

const LoginPage = () => {
    return (
        <>
        <BeeAnimation />
        <FlowerAnimation/>
            <div className="background-container relative flex flex-col items-center">
                <img src={LoginBoard} alt="login_board" className="relative flex justify-center w-[14rem] mt-[-90px]"/>
                
                <div className="input-container mt-12">
                    {/* 아이디 입력 */}
                    <div className="input-wrapper">
                    <label htmlFor="username">아이디 :</label>
                    <input id="username" type="text" placeholder="아이디를 입력하세요" className="custom-input" />
                    </div>
                    {/* 비밀번호 입력 */}
                    <div className="input-wrapper">
                        <label htmlFor="password">비밀번호 :</label>
                        <input id="password" type="password" placeholder="비밀번호를 입력하세요" className="custom-input"/>
                    </div>
                </div>

                
                    {/* 확인버튼 만들어라 지인아 ..  */}
                    <button className="confirm-button mt-7">확인</button>


            </div>
        </>
    )
}

export default LoginPage
