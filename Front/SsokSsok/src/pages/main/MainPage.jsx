import React, { useEffect, useState } from "react";
import BeeAnimation from "../../components/animations/BeeAnimation";
import FlowerAnimation from "../../components/animations/FlowerAnimation";
import SsokSsokBookClub from "../../assets/images/bookshelf_img.png"
import SsokSookBookClubBoard from "../../assets/images/main_ssokbookclub.png"
import {motion} from 'framer-motion'
import bookHansel from "../../assets/images/book_hansel.png";
import bookPrince from "../../assets/images/book_prince.png";
import bookCinderella from "../../assets/images/book_cinderella.png";
import bookHeungbu from "../../assets/images/book_heungbu.png";
import bookFox from "../../assets/images/book_fox.png";
import bookSnowWhite from "../../assets/images/book_snowwhite.png";
import bookRabbit from "../../assets/images/book_rabbit.png";
import bookSunMoon from "../../assets/images/book_sunmoon.png";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/authStore";
import { isTokenExpired } from "../../utils/tokenUtils";
import HanselBookOpening from "../../components/animations/HanselBookOpening";
import lockImg from "../../assets/images/lock.png";

const books = [
    { title: "헨젤과 그레텔", image: bookHansel },
    { title: "어린왕자", image: bookPrince },
    { title: "신데렐라", image: bookCinderella },
    { title: "흥부와 놀부", image: bookHeungbu },
    { title: "여우와 두루미", image: bookFox },
    { title: "백설공주", image: bookSnowWhite },
    { title: "토끼와 거북이", image: bookRabbit },
    { title: "해님 달님", image: bookSunMoon },
]

const MainPage = () => {
    const { accessToken } = useAuthStore()
    const navigate = useNavigate()
    useEffect(() => {
        if (!accessToken || isTokenExpired(accessToken)) {
            alert("로그인이 필요합니다.")
            navigate("/login")
        }
    }, [accessToken, navigate])

    const [openHansel, setOpenHansel] = useState(false)
    const handleBookClick = (bookTitle) => {
        if (bookTitle === "헨젤과 그레텔") {
            setOpenHansel(true)
        } else {
            alert("서비스 추후 준비중입니다 🥹")
        }
    }
    if (openHansel) return <HanselBookOpening />

    return (
        <>
        <BeeAnimation />
        <FlowerAnimation/>
        <Header />
        <div className="background-container relative flex flex-col items-center">
            <img src={SsokSookBookClubBoard} alt="SsokSsokBookClubBoard" className="w-[20rem] mb-12"/>

                {/* 📌 첫 번째 책장과 책들 */}
                <div className="relative flex flex-col items-center">
                    <img src={SsokSsokBookClub} alt="Bookshelf" className="w-[50rem] -mb-13 rotate-2 z-0" />
                    <div className="flex justify-center -mt-[26rem] z-10">
                    {books.slice(0, 4).map((book, index) => {
                        const isLocked = book.title !== "헨젤과 그레텔";
                        return (
                            <div key={index} className="relative w-[11rem] mx-2">
                                <motion.img 
                                    src={book.image} 
                                    alt={book.title} 
                                    className={`w-full ${isLocked ? "opacity-60" : ""}`}
                                    whileHover={{ scale: isLocked ? 1 : 1.1, y: isLocked ? 0 : -10 }}
                                    onClick={() => handleBookClick(book.title)}
                                    transition={{ type: "spring", stiffness: 200 }}
                                />
                                {isLocked && (
                                    <>
                                        <div className="absolute top-0 left-0 w-[11rem] bg-black bg-opacity-20 rounded-md pointer-events-none z-10" />
                                        <img 
                                            src={lockImg} 
                                            alt="lock" 
                                            className="absolute top-1/2 left-1/2 w-12 transform -translate-x-1/2 -translate-y-1/2"
                                        />
                                    </>
                                )}
                            </div>
                        )
                    })}
                    </div>
                </div>
                
                {/* 📌 두 번째 책장과 책들 */}
                <div className="relative flex flex-col items-center mt-8">
                    <img src={SsokSsokBookClub} alt="Bookshelf" className="w-[50rem] -mb-18 rotate-2 z-0" />
                    <div className="flex justify-center -mt-[26rem] z-10">
                    {books.slice(4, 8).map((book, index) => {
                        const isLocked = book.title !== "헨젤과 그레텔";
                        return (
                            <div key={index} className="relative w-[11rem] mx-2">
                                <motion.img 
                                    src={book.image} 
                                    alt={book.title} 
                                    className={`w-full ${isLocked ? "opacity-60" : ""}`}
                                    whileHover={{ scale: isLocked ? 1 : 1.1, y: isLocked ? 0 : -10 }}
                                    onClick={() => handleBookClick(book.title)}
                                    transition={{ type: "spring", stiffness: 200 }}
                                />
                                {isLocked && (
                                    <>
                                        <div className="absolute top-0 left-0 w-[11rem] bg-black bg-opacity-20 rounded-md pointer-events-none z-10" />
                                        <img 
                                            src={lockImg} 
                                            alt="lock" 
                                            className="absolute top-1/2 left-1/2 w-12 transform -translate-x-1/2 -translate-y-1/2"
                                        />
                                    </>
                                )}
                            </div>
                        )
                    })}
                    </div>
                </div>             
            </div>

            
        </>
    )
}

export default MainPage
