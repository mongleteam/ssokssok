import React, { useState, useEffect } from "react";
import BeeAnimation from "../../components/animations/BeeAnimation";
import FlowerAnimation from "../../components/animations/FlowerAnimation";
import SignupBoard from "../../assets/images/signin_board_icon.png";
import { checkIdApi, checkNickNameApi, signupApi } from "../../apis/authApi";
import "../../styles/auth/signup_input_container.css";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    nickname: "",
    email: "",
    password: "",
  })

  // 닉네임 아이디 중복체크
  const [idCheckResult, setIdCheckResult] = useState(null)
  const [nickCheckResult, setNickCheckResult] = useState(null)


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
    if ((name === "id" || name === "nickname") && value.length > 8) return
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

  const handleIdCheck = async () => {
    if (formData.id.length > 9 || !formData.id) {
      alert("아이디는 8자 이내로 입력하세요.")
      return
    }
    try {
      const res = await checkIdApi(formData.id)
      setIdCheckResult(res.data.isSuccess)
    } catch {
      alert("아이디 중복 확인 중 오류 발생")
      setIdCheckResult(false)
    }
  }
  
  const handleNickCheck = async () => {
    if (formData.nickname.length > 8 || !formData.nickname) {
      alert("닉네임은 8자 이내로 입력하세요.")
      return
    }
    try {
      const res = await checkNickNameApi(formData.nickname)
      setNickCheckResult(res.data.isSuccess)
    } catch {
      alert("닉네임 중복 확인 중 오류 발생")
      setNickCheckResult(false)
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
        <div className="flex gap-2 items-center">
          <input
            name="id"
            id="id"
            type="text"
            placeholder="아이디 입력"
            className="custom-input"
            value={formData.id}
            onChange={handleChange}
          />
          <button onClick={handleIdCheck} className="check-btn text-xl font-dodam">확인</button>

          {/* 상태에 따라 아이콘 변경 */}
          {idCheckResult !== null && (
                <p className={`text-sm mt-1 ${idCheckResult ? "text-green-600" : "text-red-500"}`}>
                  {idCheckResult ? "✅" : "❌"}
                </p>
              )}
        </div>
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
            <div className="flex gap-2 items-center">
              <input
                name="nickname"
                id="nickname"
                type="text"
                placeholder="닉네임을 입력하세요"
                className="custom-input"
                value={formData.nickname}
                onChange={handleChange}
              />
              <button onClick={handleNickCheck} className="check-btn text-xl font-dodam">확인</button>

              {nickCheckResult !== null && (
                <p className={`text-sm mt-1 ${nickCheckResult ? "text-green-600" : "text-red-500"}`}>
                  {nickCheckResult ? "✅" : "❌"}
                </p>
              )}
            </div>
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
