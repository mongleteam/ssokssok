import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import beeAnimation from "../../lottie/bee.json";

// 랜덤 위치 생성 (화면 전체 활용)
const getRandomPosition = () => ({
    x: `${Math.random() * 100}vw`,
    y: `${Math.random() * 100}vh`,
});

// 벌이 랜덤하게 이동할 경로 생성
const getRandomPath = () => new Array(6).fill(0).map(() => ({
    x: `${Math.random() * 100}vw`,
    y: `${Math.random() * 100}vh`,
}));

const BeeAnimation = () => {
    // 벌들의 경로를 저장하는 상태
    const [beePaths, setBeePaths] = useState([]);

    useEffect(() => {
        setBeePaths([
            { path: getRandomPath() }, // 벌 1의 경로
            { path: getRandomPath() }, // 벌 2의 경로
        ]);
    }, []);

    return (
        <>
            {beePaths.map((bee, index) => (
                <motion.div
                    key={index}
                    className="absolute w-[80px] h-[80px] pointer-events-none"
                    initial={bee.path[0]} // 벌이 처음 시작하는 랜덤 위치
                    animate={{
                        x: bee.path.map(p => p.x), // 벌마다 다른 X 경로
                        y: bee.path.map(p => p.y), // 벌마다 다른 Y 경로
                    }}
                    transition={{
                        duration: 20 + Math.random() * 10, // ⬅ **20~30초** 랜덤 속도 설정
                        repeat: Infinity, // **무한 반복**
                        ease: "linear", // 리셋되는 느낌을 없애기 위해 linear 사용
                    }}
                >
                    <Lottie animationData={beeAnimation} loop={true} />
                </motion.div>
            ))}
        </>
    );
};

export default BeeAnimation;
