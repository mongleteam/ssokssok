import React from "react";
import BeeAnimation from "../../components/animations/BeeAnimation";
import FlowerAnimation from "../../components/animations/FlowerAnimation";
import SsokSsokBookClub from "../../assets/images/book_shelf_hp.png"

const MainPage = () => {
    return (
        <>
        <BeeAnimation />
        <FlowerAnimation/>
            <div className="background-container relative flex flex-col items-center">

            <img src={SsokSsokBookClub} alt="SsokSsokBookClub" className="w-[70rem]"/>

            </div>
        </>
    )
}

export default MainPage
