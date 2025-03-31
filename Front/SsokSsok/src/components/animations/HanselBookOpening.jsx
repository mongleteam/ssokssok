import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import bookAnimation from "../../lottie/book.json";
import bgImg from "../../assets/images/5181830.jpg";
import "./BookOpening.css";
import { bookInfoApi } from "../../apis/bookStartApi";
import useAuthStore from "../../stores/authStore";
import useBgmStore from "../../stores/bgmStore";


const HanselBookOpening = () => {
  const navigate = useNavigate()
  const [start, setStart] = useState(false)
  const {logout} = useAuthStore()

  useEffect(() => {
    useBgmStore.getState().stopBgm()
    const t1 = setTimeout(() => setStart(true), 100)

    const t2 = setTimeout(() => {
      // ✅ API 호출
      bookInfoApi()
        .then((res) => {
          console.log("📘 동화 정보 res.data:", res.data.data)

          if (res.data.isSuccess) {
            navigate("/main/bookstart/hansel", { state: res.data.data })
          } else {
            alert("동화 정보를 불러오는 데 실패했습니다.")
          }
        })
        .catch((err) => {
          console.error("❌ API 호출 실패:", err)
          alert("서버 오류가 발생했습니다.")
          logout()
          navigate("/login")
        })
    }, 2000)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [logout, navigate])

  return (
    <div
    className="magic-scene"
    style={{ backgroundImage: `url(${bgImg})` }}
    >
    <div className="lottie-wrapper">
        <Lottie
        animationData={bookAnimation}
        loop={true}
        className="lottie-anim"
        />
    </div>

    <div className="storybook-text">
        헨젤과 그레텔 속으로...
    </div>
    </div>
  );
};

export default HanselBookOpening;
