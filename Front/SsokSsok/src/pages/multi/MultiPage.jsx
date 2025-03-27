import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/book_background.css";
import StoryHeader from "../../components/StoryHeader";
import StoryIllustration from "../../components/story/StoryIllustration";
import StoryDialogue from "../../components/story/StoryDialogue";
import MissionScreen from "../../components/story/MissionScreen";
import PageNavigationButton from "../../components/story/PageNavigationButton";
import CompleteModal from "../../components/story/CompleteModal";
import PauseModal from "../../components/story/PauseModal";
import JSZip from "jszip";
import VideoP1 from "../../components/multi/VideoP1";
import VideoP2 from "../../components/multi/VideoP2";

// 아이콘 경로
import nextIcon from "../../assets/images/pagenext_icon.png";
import previousIcon from "../../assets/images/pageprevious_icon.png";
import pauseButton from "../../assets/images/btn_pause.png";

function MultiPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [storyData, setStoryData] = useState([]);
  const [assets, setAssets] = useState({});
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [isMissionVisible, setIsMissionVisible] = useState(false); // 미션 화면 표시 여부
  const [viewedMissions, setViewedMissions] = useState({});        // 해당 페이지에서 미션을 본 적 있는지

  

  const navigate = useNavigate(); // ✅ navigate 선언

  useEffect(() => {
    const loadStoryData = async () => {
      try {
        const zipUrl = "https://ssafy-mongle.s3.ap-southeast-2.amazonaws.com/HanselAndGretelData_single.zip";
        const res = await fetch(zipUrl);
        const blob = await res.blob();
        const zip = await JSZip.loadAsync(blob);

        const fileMap = {};
        const fileNames = Object.keys(zip.files);

        for (const fileName of fileNames) {
          const file = zip.file(fileName);
          if (file) {
            const contentBlob = await file.async("blob");
            fileMap[fileName] = URL.createObjectURL(contentBlob);
          }
        }

        const storyFile = zip.file("story_multi.json");
        const storyText = await storyFile.async("string");
        const storyJson = JSON.parse(storyText);

        storyJson.forEach((page) => {
          page.image = fileMap[page.illustration];
          page.audio = fileMap[page.sound[0]];
          page.tts = fileMap[page.tts];
          page.scriptFile = fileMap[page.script];
          page.hintImage = fileMap[page.hint];
        });

        setAssets(fileMap);
        setStoryData(storyJson);
      } catch (error) {
        console.error("데이터 로딩 에러:", error);
      }
    };

    loadStoryData();
  }, []);

  const handleNextPage = () => {
    const currentData = storyData[currentPage];
  
    if (isMissionVisible) {
      setIsMissionVisible(false);
      setViewedMissions((prev) => ({ ...prev, [currentPage]: true }));
      setCurrentPage((prev) => prev + 1);
    } else if (currentData.instructions && !viewedMissions[currentPage]) {
      setIsMissionVisible(true);
    } else {
      setCurrentPage((prev) => prev + 1);
    }
  };
  
  

  const handlePreviousPage = () => {
    if (isMissionVisible) {
      setIsMissionVisible(false);
    } else if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };
  

  return (
    <div className="relative book-background-container flex flex-col items-center">
      {/* 페이지 네비게이션 버튼 */}
      <div className="absolute inset-y-0 w-full flex justify-between items-center px-8 z-100">
        <PageNavigationButton
          icon={previousIcon}
          altText="이전 페이지"
          onClick={handlePreviousPage}
          disabled={currentPage === 0 && !isMissionVisible}
          />
        <PageNavigationButton
          icon={nextIcon}
          altText="다음 페이지"
          onClick={handleNextPage}
          disabled={currentPage === storyData.length - 1 && !isMissionVisible}
        />

      </div>

      {/* 상단 텍스트 */}
      <StoryHeader />

      {/* 중앙 콘텐츠 */}
      <div className="flex w-full h-[75%] max-w-[1200px] px-4 lg:px-12">
        <div className="flex flex-col w-full lg:w-[60%] space-y-4 pr-4">
          {storyData.length > 0 && (
            <StoryIllustration storyData={storyData[currentPage]} />
          )}
          {isMissionVisible ? (
            <MissionScreen storyData={storyData[currentPage]} assets={assets} />
          ) : (
            <StoryDialogue storyData={storyData[currentPage]} assets={assets} />
          )}

        </div>

        <div className="flex flex-col w-full lg:w-[40%] space-y-4 pl-4">
          <VideoP1 />
          <VideoP2 />
        </div>
      </div>

      {/* 독서 완료 모달 */}
      {isCompleteModalOpen && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <CompleteModal />
        </div>
      )}

      {/* 일시 정지 모달 */}
      {isPauseModalOpen && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <PauseModal />
        </div>
      )}

      {!isMissionVisible && (
        <button
          onClick={() => {
            if (currentPage === storyData.length - 1) {
              console.log("독서 완료!");
              setIsCompleteModalOpen(true);
            } else {
              console.log("그만 읽기 클릭! 추후 저장 로직 연결 예정");
              setIsPauseModalOpen(true);
              // 저장 API 연결 예정
            }
          }}
          className="fixed bottom-8 right-8 z-50 w-52 h-20 font-cafe24 text-xl"
        >
          <img
            src={pauseButton}
            alt="그만 읽기"
            className="absolute inset-0 w-full h-full object-contain"
          />
          <span className="relative z-10">
            {currentPage === storyData.length - 1 ? "읽기 완료" : "그만 읽기"}
          </span>
        </button>
      )}

    </div>
  );
}

export default MultiPage;
