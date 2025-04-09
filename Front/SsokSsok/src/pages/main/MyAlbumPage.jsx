import React, { useEffect, useState } from "react";
import BeeAnimation from "../../components/animations/BeeAnimation";
import FlowerAnimation from "../../components/animations/FlowerAnimation";
import Header from "../../components/Header";
import MyAlbumBoard from "../../assets/images/mybookpicture.png";
import AlbumBoard from "../../assets/images/board_album.png";
import { deleteAlbumApi, getAlbumApi } from "../../apis/albumApi";
import "./MyAlbumPage.css";
import CustomAlert from "../../components/CustomAlert";

const MyAlbumPage = () => {
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [albumData, setAlbumData] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [deleteMode, setDeleteMode] = useState(false);

  useEffect(() => {
    getAlbumApi().then((res) => {
      setAlbumData(res.data.data);
    });
  }, []);

  const toggleSelectImage = (id) => {
    setSelectedImages((prev) =>
      prev.includes(id) ? prev.filter((pk) => pk !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedImages(albumData.map((item) => item.myalbumPk));
  };

  const deselectAll = () => {
    setSelectedImages([]);
  };

  const deleteSelectedImages = async () => {
    if (selectedImages.length === 0) {
      setAlertMessage("삭제할 사진을 선택해주세요!");
      setShowAlert(true);
      return;
    }
    try {
      await deleteAlbumApi({ myalbumPks: selectedImages });
      setAlbumData((prev) =>
        prev.filter((item) => !selectedImages.includes(item.myalbumPk))
      );
      setSelectedImages([]);
      setDeleteMode(false);
      setAlertMessage("삭제가 완료되었습니다!");
      setShowAlert(true);
    } catch (err) {
      console.error("삭제 실패:", err);
      setAlertMessage("삭제 중 오류가 발생했습니다.");
      setShowAlert(true);
    }
  };

  return (
    <>
      <BeeAnimation />
      <FlowerAnimation />
      <Header />

      <div className="background-container relative flex flex-col items-center min-h-screen w-full">
        <div className="relative w-[88vw] max-w-[1200px] aspect-[13/10] mt-[7vh]">

          {/* ✅ 삭제 버튼 - 보드 내부 기준으로 위치 고정 */}
          {!deleteMode && albumData.length > 0 && (
            <button
              className="absolute bottom-[110px] right-[200px] bg-white hover:bg-red-600  px-4 py-2 rounded-lg shadow-lg z-30 font-whitechalk text-2xl"
              onClick={() => {
                setDeleteMode(true);
                setSelectedImages([]);
              }}
            >
              🗑️
            </button>
          )}

          {/* 타이틀 */}
          <img
            src={MyAlbumBoard}
            alt="MyAlbumBoard"
            className="absolute top-[48px] left-1/2 transform -translate-x-1/2 w-[360px] z-20"
          />
          <img src={AlbumBoard} alt="albumBoard" className="w-full h-full" />

          {/* 이미지 그리드 */}
          <div className="absolute top-[25.5%] left-[14%] w-[72%] h-[58%] overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-4 gap-4">
              {albumData.length === 0 ? (
                <p className="col-span-4 text-center font-whitechalk text-gray-800 text-4xl mt-56 
                ">
                저장된 사진이 없습니다.
              </p>
              ) : (
                albumData.map((item) => (
                  <div
                    key={item.myalbumPk}
                    className={`relative flex flex-col items-center bg-[#fef5e7] p-1 rounded-lg shadow-md ${
                      deleteMode ? "border-2 border-yellow-200" : ""
                    }`}
                  >
                    {deleteMode && (
                      <input
                        type="checkbox"
                        checked={selectedImages.includes(item.myalbumPk)}
                        onChange={() => toggleSelectImage(item.myalbumPk)}
                        className="absolute top-1 right-1 w-6 h-6 accent-yellow-400 border-2 border-white rounded-sm shadow-md z-30"
                      />
                    )}
                    <img
                      src={item.myalbumImgUrl}
                      alt="album"
                      onClick={() => !deleteMode && setPreviewImage(item.myalbumImgUrl)}
                      className={`w-full aspect-square object-cover rounded-md cursor-pointer ${
                        deleteMode ? "opacity-80" : ""
                      }`}
                    />
                    <p className="text-xs mt-1 text-gray-700 font-dodam">{item.createdDate}</p>
                    <p className="text-sm font-semibold text-brown-800 font-dodam">{item.title}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ 삭제 모드 툴바 */}
      {deleteMode && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-4 bg-white px-6 py-3 rounded-xl shadow-xl border border-gray-300">
          <span className="font-whitechalk text-m">{selectedImages.length}개 선택됨</span>
          <button
            onClick={selectAll}
            className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md font-whitechalk"
          >
            전체 선택
          </button>
          <button
            onClick={deselectAll}
            className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-md font-whitechalk"
          >
            선택 해제
          </button>
          <button
            onClick={deleteSelectedImages}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md font-whitechalk"
          >
            삭제
          </button>
          <button
            onClick={() => {
              setDeleteMode(false);
              setSelectedImages([]);
            }}
            className="text-gray-500 hover:text-black font-whitechalk"
          >
            취소
          </button>
        </div>
      )}

      {/* 이미지 미리보기 */}
      {previewImage && (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="relative bg-[#deb887] border-4 border-[#a47148] rounded-2xl shadow-2xl p-6 flex flex-col items-center w-[85vw] max-w-[800px] min-h-[500px]">
        
        {/* 닫기 버튼 (우측 상단 못 모양 느낌) */}
        <button
          onClick={() => setPreviewImage(null)}
          className="absolute top-3 right-4 text-white bg-[#8b5e3c] hover:bg-[#a9714d] px-3 py-1 rounded-full shadow-md font-bold"
        >
          ✕
        </button>

      {/* 이미지 프리뷰 */}
      <img
        src={previewImage}
        alt="preview"
        className="rounded-lg max-h-[60vh] object-contain mt-8 shadow-md border-4 border-white"
      />

        </div>
      </div>
    )}


      {/* 알림 */}
      {showAlert && (
        <CustomAlert message={alertMessage} onClose={() => setShowAlert(false)} />
      )}
    </>
  );
};

export default MyAlbumPage;
