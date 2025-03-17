import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import beeAnimation from "../../lottie/bee.json";

// 화면 전체를 랜덤하게 활용하는 위치 생성 함수
const getRandomPosition = () => ({
    x: `${Math.random() * 100}vw`, // 화면 전체 너비에서 랜덤 위치
    y: `${Math.random() * 100}vh`, // 화면 전체 높이에서 랜덤 위치
});

const BeeAnimation = () => {
    // 벌들의 초기 위치를 저장할 상태
    const [beePositions, setBeePositions] = useState([]);

    // 컴포넌트가 처음 렌더링될 때 랜덤 위치 설정
    useEffect(() => {
        setBeePositions([
            getRandomPosition(),
            getRandomPosition(),
        ]);
    }, []);

    return (
        <>
            {beePositions.map((pos, index) => (
                <motion.div
                    key={index}
                    className="absolute w-[80px] h-[80px] pointer-events-none"
                    initial={{ x: pos.x, y: pos.y }} // 랜덤한 위치에서 시작
                    animate={{
                        x: ["0vw", "100vw", "0vw"], // 화면 전체를 가로질러 이동
                        y: ["0vh", "100vh", "50vh", "20vh", "80vh", "30vh", "70vh", "0vh"], // 다양한 높이에서 랜덤 이동
                    }}
                    transition={{
                        duration: 20 + Math.random() * 5, // 10~15초 사이 랜덤 이동 속도
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <Lottie animationData={beeAnimation} loop={true} />
                </motion.div>
            ))}
        </>
    );
};

export default BeeAnimation;
