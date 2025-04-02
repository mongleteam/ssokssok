import React, { useEffect, useState } from "react";
import BeeAnimation from "../../components/animations/BeeAnimation";
import FlowerAnimation from "../../components/animations/FlowerAnimation";
import Header from "../../components/Header";
import MyAlbumBoard from "../../assets/images/mybookpicture.png"
import AlbumBoard from "../../assets/images/wood_board_album.png"
import { getAlbumApi } from "../../apis/albumApi";
import './MyAlbumPage.css';
const MyAlbumPage = () => {

    const [albumData, setAlbumData] = useState([])
    useEffect(() => {
        getAlbumApi()
        .then((res) => {
            console.log(res.data.data)
            setAlbumData(res.data.data)
        })
    }, [])

    return (
        <>
          <BeeAnimation />
          <FlowerAnimation />
          <Header />
          <div className="background-container relative flex flex-col items-center min-h-screen">
            {/* 타이틀 이미지 */}
            <img
              src={MyAlbumBoard}
              alt="MyAlbumBoard"
              className="w-[22rem] mt-20 -translate-y-80 z-10"
            />
    
            {/* 앨범 스크롤 컨테이너 */}
            <div className="absolute bottom-[5.5rem] left-1/2 translate-x-[-52.5%] w-[43rem] h-[27rem] overflow-y-scroll z-10 custom-scrollbar">
              <div className="grid grid-cols-4 gap-4 px-4 py-2">
                {albumData.map((item) => (
                  <div
                    key={item.myalbumPk}
                    className="flex flex-col items-center bg-[#fef5e7] p-1 rounded-lg shadow-md"
                  >
                    <img
                      src={item.myalbumImgUrl}
                      alt="album"
                      className="w-full aspect-square object-cover rounded-md"
                    />
                    <p className="text-xs mt-1 text-gray-700 font-dodam">{item.createdDate}</p>
                    <p className="text-sm font-semibold text-brown-800 font-dodam">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>
    
            {/* 나무 앨범 보드 배경 */}
            <img
              src={AlbumBoard}
              alt="albumBoard"
              className="w-[57rem] max-w-none absolute bottom-[-7rem] left-1/2 translate-x-[-50%]"
            />
          </div>
        </>
      );
    };
    
    export default MyAlbumPage;