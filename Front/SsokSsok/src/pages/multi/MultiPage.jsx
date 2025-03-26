import React, { useState, useEffect } from "react";
import "../../styles/book_background.css"; // CSS 파일 임포트
import StoryHeader from "../../components/StoryHeader"; // 스토리 헤더 컴포넌트 임포트
import StoryIllustration from "../../components/story/StoryIllustration"; // 삽화 컴포넌트 임포트
import StoryDialogue from "../../components/story/StoryDialogue"; // 대사 컴포넌트 임포트
import PageNavigationButton from "../../components/story/PageNavigationButton"; // 페이지 네비게이션 버튼 컴포넌트 임포트
import JSZip from "jszip"; // JSZip 라이브러리 임포트
import VideoP1 from "../../components/multi/VideoP1"
import VideoP2 from "../../components/multi/VideoP2"

// 아이콘 경로
import nextIcon from "../../assets/images/pagenext_icon.png"; // 다음 페이지 아이콘
import previousIcon from "../../assets/images/pageprevious_icon.png"; // 이전 페이지 아이콘

// MultiPage 컴포넌트
function MultiPage() {
  // 현재 페이지 번호 상태
  const [currentPage, setCurrentPage] = useState(0);
  // 스토리 데이터 상태 (삽화, 스크립트, 오디오 등)
  const [storyData, setStoryData] = useState([]);
  const [assets, setAssets] = useState({}); // 파일 URL을 저장할 상태

  // 데이터 로딩 useEffect
  useEffect(() => {
    const loadStoryData = async () => {
      try {
        // ZIP 파일에서 데이터 로딩
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

        // 스토리 데이터 JSON 파일 읽기
        const storyFile = zip.file("story_single.json");
        const storyText = await storyFile.async("string");
        const storyJson = JSON.parse(storyText);

        // 각 페이지에 필요한 데이터 추가
        storyJson.forEach((page) => {
          page.image = fileMap[page.image];
          page.audio = fileMap[page.sounds];
          page.tts = fileMap[page.tts];
          page.scriptFile = fileMap[page.textFile];
        });

        setAssets(fileMap);
        setStoryData(storyJson);
      } catch (error) {
        console.error("데이터 로딩 에러:", error);
      }
    };
    loadStoryData();
  }, []);

  useEffect(() => {
    console.log("현재 페이지 데이터:", storyData);
  }, [storyData]);

  // 다음 페이지로 이동하는 함수
  const handleNextPage = () => {
    if (currentPage < storyData.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  // 이전 페이지로 이동하는 함수
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="relative book-background-container flex flex-col items-center">
      {/* 페이지 네비게이션 버튼 */}
      <div className="absolute inset-y-0 w-full flex justify-between items-center px-8 z-100">
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

      {/* 상단 텍스트 */}
      <StoryHeader />

      {/* 중앙 레이아웃 */}
      <div className="flex w-full max-w-[1200px] px-4 lg:px-12">
        {/* 좌측 콘텐츠 */}
        <div className="flex flex-col w-full lg:w-[60%] space-y-4 pr-4">
          {storyData.length > 0 && (
            <StoryIllustration storyData={storyData[currentPage]} />
          )}
          {storyData.length > 0 && (
            <StoryDialogue storyData={storyData[currentPage]} assets={assets} />
          )}

        </div>

        {/* 우측 콘텐츠 */}
        <div className="flex flex-col w-full lg:w-[40%] space-y-4 pl-4">
          {/* 비디오 및 기타 콘텐츠 */}
          <VideoP1 />
          <VideoP2 />
        </div>
      </div>

    </div>
  );
}

export default MultiPage;
