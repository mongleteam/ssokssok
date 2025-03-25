import React from "react";
import BeeAnimation from "../../components/animations/BeeAnimation";
import FlowerAnimation from "../../components/animations/FlowerAnimation";
import Header from "../../components/Header";

const BookStartPage = () => {
    return (
        <>
        <BeeAnimation />
        <FlowerAnimation />
        <Header />
        <div className="background-container relative flex flex-col items-center">
            헨젤과 그레텔 동화 시작!
        </div>
        </>
    )
}

export default BookStartPage