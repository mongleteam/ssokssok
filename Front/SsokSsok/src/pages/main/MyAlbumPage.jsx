import React, { useEffect, useState } from "react";
import BeeAnimation from "../../components/animations/BeeAnimation";
import FlowerAnimation from "../../components/animations/FlowerAnimation";
import Header from "../../components/Header";
import MyAlbumBoard from "../../assets/images/mybookpicture.png"
import AlbumBoard from "../../assets/images/wood_board_album.png"
import { deleteAlbumApi, getAlbumApi } from "../../apis/albumApi";
import './MyAlbumPage.css';
const MyAlbumPage = () => {

    const [albumData, setAlbumData] = useState([])
    const [selectedImages, setSelectedImages] = useState([]); // 삭제할 이미지 선택
    const [previewImage, setPreviewImage] = useState(null);    // 모달용 이미지
    useEffect(() => {
        getAlbumApi()
        .then((res) => {
            console.log(res.data.data)
            setAlbumData(res.data.data)
        })
    }, [])

    const deleteSelectedImages = async () => {
      if (selectedImages.length === 0) {
        alert("삭제할 사진을 선택해주세요!");
        return;
      }
    
      try {
        await deleteAlbumApi({ myalbumPks: selectedImages });
        alert("삭제가 완료되었습니다!");
    
        // 삭제된 항목을 화면에서 제거
        setAlbumData((prev) => prev.filter(item => !selectedImages.includes(item.myalbumPk)));
        setSelectedImages([]);
      } catch (err) {
        console.error("삭제 실패:", err);
        alert("삭제 중 오류가 발생했습니다.");
      }
    };

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
              <div className="flex justify-end px-4 pt-0">
              <button
                className="bg-red-400 text-white py-1.5 px-4 rounded font-whitechalk text-sm"
                onClick={deleteSelectedImages}
              >
                선택 삭제
              </button>
              </div>
              <div className="grid grid-cols-4 gap-4 px-4 py-2">
              {albumData.map((item) => (
                <div
                  key={item.myalbumPk}
                  className="relative flex flex-col items-center bg-[#fef5e7] p-1 rounded-lg shadow-md"
                >
                  <input
                    type="checkbox"
                    className="absolute top-1 right-1 w-4 h-4"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedImages((prev) => [...prev, item.myalbumPk]);
                      } else {
                        setSelectedImages((prev) => prev.filter((id) => id !== item.myalbumPk));
                      }
                    }}
                  />
                  <img
                    src={item.myalbumImgUrl}
                    alt="album"
                    onClick={() => setPreviewImage(item.myalbumImgUrl)}
                    className="w-full aspect-square object-cover rounded-md cursor-pointer"
                  />
                  <p className="text-xs mt-1 text-gray-700 font-dodam">{item.createdDate}</p>
                  <p className="text-sm font-semibold text-brown-800 font-dodam">{item.title}</p>
                </div>
              ))}

              </div>
            </div>

            {previewImage && (
              <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                <div className="bg-white p-4 rounded-lg shadow-lg">
                  <img src={previewImage} alt="preview" className="max-w-[80vw] max-h-[80vh]" />
                  <button
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded font-whitechalk"
                    onClick={() => setPreviewImage(null)}
                  >
                    닫기
                  </button>
                </div>
              </div>
            )}

    
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