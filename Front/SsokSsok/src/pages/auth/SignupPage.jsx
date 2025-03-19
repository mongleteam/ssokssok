import React, {useState, useEffect} from "react";
import BeeAnimation from "../../components/animations/BeeAnimation";
import FlowerAnimation from "../../components/animations/FlowerAnimation";
import SignupBoard from "../../assets/images/signin_board_icon.png";

import "../../styles/auth/signup_input_container.css";

const SignupPage = () => {

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isMatch, setIsMatch] = useState(null)

    useEffect(() => {
        if (confirmPassword === "") {
            setIsMatch(null)
        } else {
            setIsMatch(password === confirmPassword)
        }
    }, [password, confirmPassword])

    return (
        <>
            <BeeAnimation />
            <FlowerAnimation />
            <div className="background-container relative flex flex-col items-center">
                {/* 회원가입 팻말 */}
                <img src={SignupBoard} alt="SignupBoard" className="relative flex justify-center w-[14rem] mt-[-50px]" />

                {/* 입력 폼 */}
                <div className="input-container mt-7">
                    {/* 아이디 입력 */}
                    <div className="input-wrapper">
                        <label htmlFor="username">아이디 :</label>
                        <input id="username" type="text" placeholder="아이디를 입력하세요" className="custom-input" />
                    </div>

                    {/* 이메일 입력 */}
                    <div className="input-wrapper">
                        <label htmlFor="email">이메일 :</label>
                        <input id="email" type="email" placeholder="이메일을 입력하세요" className="custom-input" />
                    </div>

                    {/* 닉네임 입력 */}
                    <div className="input-wrapper">
                        <label htmlFor="nickname">닉네임 :</label>
                        <input id="nickname" type="text" placeholder="닉네임을 입력하세요" className="custom-input" />
                    </div>

                    {/* 비밀번호 입력 */}
                    <div className="input-wrapper">
                        <label htmlFor="password">비밀번호 :</label>
                        <input id="password" type="password" placeholder="비밀번호를 입력하세요" className="custom-input" 
                            value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </div>

                    {/* 비밀번호 확인 */}
                    <div className="input-wrapper">
                        <label htmlFor="confirmPassword">비밀번호 확인 :</label>
                        <input id="confirmPassword" type="password" placeholder="비밀번호를 다시 입력하세요" className="custom-input" 
                            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                        {/* 비밀번호 확인 */}
                        {isMatch !== null && (
                            <span className={`check-icon ${isMatch ? "valid" : "invalid"}`}>
                                {isMatch ? "✅" : "❌"}
                            </span>
                        )}
                    </div>

                </div>

                    {/* 확인버튼 만들어라 지인아 ..  */}
                    <button className="confirm-button mt-7">확인</button>

            </div>
        </>
    );
};

export default SignupPage;
