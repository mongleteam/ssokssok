import React from "react";
import Lottie from "lottie-react";
import rabbitAnimation from "../../lottie/rabbit.json"; // 🐰 Lottie 파일 불러오기

const RabbitAnimation = () => {
    return (
        <div className="flex justify-center w-full">
            <div className="absolute top-[-158px] left-[82%] -translate-x-1/2 w-[150px] h-[150px]">
                <Lottie animationData={rabbitAnimation} loop={true} />
            </div>
        </div>
    );
};

export default RabbitAnimation;
