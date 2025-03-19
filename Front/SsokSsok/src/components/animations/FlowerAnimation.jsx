import React from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import flower1 from "../../lottie/flower1.json";
import flower2 from "../../lottie/flower2.json";
import flower3 from "../../lottie/flower3.json";
import flower4 from "../../lottie/flower4.json";

const flowers = [
    { animation: flower1, x: "5%", bottom: "-3%", delay: 0 }, // 왼쪽 1번 꽃 (더 아래로)
    { animation: flower3, x: "15%", bottom: "0%", delay: 0.5 }, // 왼쪽 2번 꽃 (더 아래로)
    { animation: flower4, x: "75%", bottom: "0%", delay: 0.3 }, // 오른쪽 1번 꽃 (원래 위치)
    { animation: flower2, x: "85%", bottom: "0%", delay: 0.8 }, // 오른쪽 2번 꽃 (원래 위치)
];

const FlowerAnimation = () => {
    return (
        <>
            {flowers.map((flower, index) => (
                <motion.div
                    key={index}
                    className="absolute w-[200px] h-[200px] pointer-events-none" // 🌸 크기 그대로
                    style={{ left: flower.x, bottom: flower.bottom }} // 🌼 왼쪽 꽃들은 좀 더 아래로!
                    animate={{
                        y: ["0px", "-10px", "0px", "10px", "0px"], // 위아래 흔들림
                        rotate: ["0deg", "3deg", "-3deg", "0deg"], // 좌우 흔들림
                    }}
                    transition={{
                        duration: 5, // ⏳ 흔들림 속도 살짝 느리게
                        repeat: Infinity, // ♾️ 무한 반복
                        ease: "easeInOut",
                        delay: flower.delay, // 🎭 움직임 패턴 다르게!
                    }}
                >
                    <Lottie animationData={flower.animation} loop={true} />
                </motion.div>
            ))}
        </>
    );
};

export default FlowerAnimation;
