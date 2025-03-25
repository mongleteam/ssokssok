import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import bookAnimation from "../../lottie/book.json";
import bgImg from "../../assets/images/5181830.jpg";
import "./BookOpening.css";

const HanselBookOpening = () => {
  const navigate = useNavigate();
  const [start, setStart] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setStart(true), 100);
    const t2 = setTimeout(() => navigate("/main/bookstart/hansel"), 2000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [navigate]);

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
