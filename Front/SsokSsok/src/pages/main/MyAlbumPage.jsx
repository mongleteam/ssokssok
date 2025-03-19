import React from "react";
import BeeAnimation from "../../components/animations/BeeAnimation";
import FlowerAnimation from "../../components/animations/FlowerAnimation";
import Header from "../../components/Header";
import MyAlbumBoard from "../../assets/images/mybookpicture.png"

const MyAlbumPage = () => {
    return (
        <>
        <BeeAnimation />
        <FlowerAnimation />
        <Header />
        <div className="background-container relative flex flex-col items-center">
            <img src={MyAlbumBoard} alt="MyAlbumBoard" className="w-[18rem] mb-12"/>
            {/* 무한스크롤 앨범 UI 대기 */}
        </div>
        </>
    )
}

export default MyAlbumPage