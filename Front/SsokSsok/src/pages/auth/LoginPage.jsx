import React, { useState, useEffect } from "react";
import BeeAnimation from "../../components/animations/BeeAnimation";
import FlowerAnimation from "../../components/animations/FlowerAnimation";
import LoginBoard from "../../assets/images/login_board_icon.png"
import "../../styles/auth/signup_input_container.css";
import { useBeforeUnload, useNavigate } from "react-router-dom";
import { loginApi } from "../../apis/authApi";
import { jwtDecode } from "jwt-decode";
import useAuthStore from "../../stores/authStore";
import { mypageInfoApi } from "../../apis/myPageApi";
import { isTokenExpired } from "../../utils/tokenUtils";
import CustomAlert from "../../components/CustomAlert";
const LoginPage = () => {
    const [alertMessage, setAlertMessage] = useState("")
    const [showAlert, setShowAlert] = useState(false);
    const navigate = useNavigate()
    const {setAccessToken, setUser} = useAuthStore()
    const [formData, setFormData] = useState({
        id: "",
        password: "",
    })

    // useEffect(() => {
    //   const token = isTokenExpired()
    //   if (token) {
    //     navigate("/main")
    //   }
    // }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
          // 아이디 필드 유효성: 영문만 허용
          if (name === "id") {
            if (!/^[a-zA-Z0-9]*$/.test(value)) return; // 영문 또는 숫자만 허용
          }

          // 공백 입력은 모든 필드에서 금지
          if (/\s/.test(value)) return;
        setFormData((prev) => ({ ...prev, [name]: value }))
      }

      
    
      const handleLogin = async () => {
        try {
          const res = await loginApi(formData)
          const { accessToken, refreshToken } = res.data.data
          useAuthStore.getState().setAccessToken(accessToken)

          if (!accessToken || !refreshToken) {
            alert("서버로부터 토큰을 받지 못했습니다.")
            return
          }
      
          // 디코딩 확인만 하고 굳이 만료 검사 X
          try {
            jwtDecode(accessToken) // 디코딩 시도만 해서 유효성만 체크
          } catch {
            alert("유효하지 않은 토큰입니다.")
            return
          }
      
          setAccessToken(accessToken) // Zustand + localStorage 저장

          // setAlertMessage("로그인 성공!")
          // setShowAlert(true)
          navigate("/main")
        } catch (error) {
          // console.error("로그인 실패:", error)
          setAlertMessage("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.")
          setShowAlert(true)
        }
      }
      

    return (
        <>
        <BeeAnimation />
        <FlowerAnimation/>
            <div className="background-container relative flex flex-col items-center">
                <img src={LoginBoard} alt="login_board" className="relative flex justify-center w-[17rem] mt-[-90px]"/>
                
                <div className="input-container mt-10">
                    {/* 아이디 입력 */}
                    <div className="input-wrapper">
                    <label htmlFor="id">아이디 :</label>
                    <input id="id" name="id" type="text" placeholder="아이디를 입력하세요" className="custom-input" 
                    value={formData.id} onChange={handleChange}/>
                    </div>
                    {/* 비밀번호 입력 */}
                    <div className="input-wrapper">
                        <label htmlFor="password">비밀번호 :</label>
                        <input id="password" name="password" type="password" placeholder="비밀번호를 입력하세요" className="custom-input"
                        value={formData.password} onChange={handleChange}/>
                    </div>
                </div>

                
              {/* 확인버튼 만들어라 지인아 ..  */}
              <button className="confirm-button mt-7" onClick={() => {
                handleLogin()
              }}>로그인</button>
              {/* <button className="confirm-button mt-4"   onClick={() => {
                navigate("/signup")
              }}>회원가입</button> */}


            </div>
            {showAlert && (
              <CustomAlert 
                message={alertMessage} 
                onClose={() => setShowAlert(false)} 
              />
            )}
        </>
    )
}

export default LoginPage
