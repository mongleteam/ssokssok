import React from "react";
import "../../styles/book_background.css";
import StoryIllustration from "../../components/story/StoryIllustration";
import MissionScreen from "../../components/story/MissionScreen";
import PageNavigationButton from "../../components/story/PageNavigationButton";
import VideoP1 from "../../components/multi/VideoP1";
import VideoP2 from "../../components/multi/VideoP2";

// 아이콘 경로
import nextIcon from "../../assets/images/pagenext_icon.png";
import previousIcon from "../../assets/images/pageprevious_icon.png";

function MultiPage() {
  const handleNextPage = () => {
    console.log("다음 페이지로 이동");
    // 페이지 이동 로직 추가
  };

  const handlePreviousPage = () => {
    console.log("이전 페이지로 이동");
    // 페이지 이동 로직 추가
  };

  return (
    <div className="relative book-background-container flex flex-col items-center">
      {/* 상단 텍스트 */}
      <h1 className="font-cafe24 text-3xl mb-4">멀티 모드</h1>

      {/* 중앙 레이아웃 */}
      <div className="flex w-full max-w-[1200px]">
        {/* 좌측 콘텐츠 */}
        <div className="flex flex-col w-[70%] space-y-4 pr-4">
          <StoryIllustration />
          <MissionScreen missionText="반짝이는 조약돌을 주워 보세요!" progress={4} />
        </div>

        {/* 우측 콘텐츠 */}
        <div className="flex flex-col w-[30%] space-y-4 pl-4">
          <VideoP1 />
          <VideoP2 />
        </div>
      </div>

      {/* 페이지 네비게이션 버튼 */}
      <div className="absolute inset-y-0 w-full flex justify-between items-center px-16">
        {/* 이전 버튼 */}
        <PageNavigationButton
          icon={previousIcon}
          altText="이전 페이지"
          onClick={handlePreviousPage}
        />

        {/* 다음 버튼 */}
        <PageNavigationButton
          icon={nextIcon}
          altText="다음 페이지"
          onClick={handleNextPage}
        />
      </div>
    </div>
  );
}

export default MultiPage;
