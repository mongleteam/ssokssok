import React, { useState, useEffect } from "react";
import BeeAnimation from "../../components/animations/BeeAnimation";
import FlowerAnimation from "../../components/animations/FlowerAnimation";
import SignupBoard from "../../assets/images/signin_board_icon.png";
import { signupApi } from "../../apis/authApi";
import "../../styles/auth/signup_input_container.css";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    nickname: "",
    email: "",
    password: "",
  })

  const [confirmPassword, setConfirmPassword] = useState("")
  const [isMatch, setIsMatch] = useState(null)

  useEffect(() => {
    if (confirmPassword === "") {
      setIsMatch(null)
    } else {
      setIsMatch(formData.password === confirmPassword)
    }
  }, [formData.password, confirmPassword])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignup = async () => {
    if (!isMatch) {
      alert("비밀번호가 일치하지 않습니다.")
      return;
    }

    try {
        const res = await signupApi(formData)
      
        if (res.status === 201 || res.status === 200) {
          alert("회원가입 성공!")
          window.location.href = "/login"
        } else {
          alert("회원가입에 실패했습니다.")
          console.log("BASE_URL", import.meta.env.VITE_SPRING_API_URL)
        }
      } catch (err) {
        console.error("회원가입 실패:", err)
        alert("회원가입에 실패했습니다.")
        console.log("BASE_URL", import.meta.env.VITE_SPRING_API_URL)
      }
  }

  return (
    <>
      <BeeAnimation />
      <FlowerAnimation />
      <div className="background-container relative flex flex-col items-center">
        <img
          src={SignupBoard}
          alt="SignupBoard"
          className="relative flex justify-center w-[14rem] mt-[-50px]"
        />

        <div className="input-container mt-7">
          <div className="input-wrapper">
            <label htmlFor="id">아이디 :</label>
            <input
              name="id"
              id="id"
              type="text"
              placeholder="아이디를 입력하세요"
              className="custom-input"
              value={formData.id}
              onChange={handleChange}
            />
          </div>

          <div className="input-wrapper">
            <label htmlFor="name">이름 :</label>
            <input
              name="name"
              id="name"
              type="text"
              placeholder="이름을 입력하세요"
              className="custom-input"
              value={formData.name}
              onChange={handleChange}
            />
          </div>



          <div className="input-wrapper">
            <label htmlFor="nickname">닉네임 :</label>
            <input
              name="nickname"
              id="nickname"
              type="text"
              placeholder="닉네임을 입력하세요"
              className="custom-input"
              value={formData.nickname}
              onChange={handleChange}
            />
          </div>

          <div className="input-wrapper">
            <label htmlFor="email">이메일 :</label>
            <input
              name="email"
              id="email"
              type="email"
              placeholder="이메일을 입력하세요"
              className="custom-input"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-wrapper">
            <label htmlFor="password">비밀번호 :</label>
            <input
              name="password"
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              className="custom-input"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="input-wrapper">
            <label htmlFor="confirmPassword">비밀번호 확인 :</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              className="custom-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {isMatch !== null && (
              <span className={`check-icon ${isMatch ? "valid" : "invalid"}`}>
                {isMatch ? "✅" : "❌"}
              </span>
            )}
          </div>
        </div>

        <button className="confirm-button mt-7" onClick={handleSignup}>
          회원가입
        </button>
      </div>
    </>
  )
}

export default SignupPage;
