import React, { useState, useEffect } from "react";
import "../../styles/book_background.css"; // CSS 파일 임포트
import StoryHeader from "../../components/StoryHeader"; // 스토리 헤더 컴포넌트 임포트
import StoryIllustration from "../../components/story/StoryIllustration"; // 삽화 컴포넌트 임포트
import StoryDialogue from "../../components/story/StoryDialogue"; // 대사 컴포넌트 임포트
import MissionScreen from "../../components/story/MissionScreen"; // 미션 스크린 컴포넌트 임포트
import PageNavigationButton from "../../components/story/PageNavigationButton"; // 페이지 네비게이션 버튼 컴포넌트 임포트
import VideoP1 from "../../components/multi/VideoP1"; // 비디오 1 컴포넌트 임포트
import VideoP2 from "../../components/multi/VideoP2"; // 비디오 2 컴포넌트 임포트

// 아이콘 경로
import nextIcon from "../../assets/images/pagenext_icon.png"; // 다음 페이지 아이콘
import previousIcon from "../../assets/images/pageprevious_icon.png"; // 이전 페이지 아이콘
import JSZip from "jszip"; // JSZip 라이브러리 임포트

// MultiPage 컴포넌트
function MultiPage() {
  // 현재 페이지 번호 상태
  const [currentPage, setCurrentPage] = useState(0);
  // 지시사항 표시 여부 상태
  const [showInstruction, setShowInstruction] = useState(false);
  // 스토리 데이터 상태 (삽화, 스크립트, 오디오 등)
  const [storyData, setStoryData] = useState([]);

  // 데이터 로딩 useEffect
  useEffect(() => {
    const loadStoryData = async () => {
      try {
        // ZIP 파일에서 데이터 로딩
        const storyData = await loadStoryDataFromZip();
        console.log("로딩된 스토리 데이터:", storyData);
        setStoryData(storyData);
      } catch (error) {
        console.error("데이터 로딩 에러:", error);
      }
    };
    loadStoryData();
  }, []);

  // 다음 페이지로 이동하는 함수
  const handleNextPage = () => {
    if (showInstruction) {
      // 지시사항 표시 중이면 다음 페이지로 이동
      setShowInstruction(false);
      setCurrentPage(currentPage + 1);
    } else {
      if (currentPage < storyData.length - 1) {
        const currentPageData = storyData[currentPage];
        if (currentPageData.instruction) {
          // 지시사항이 있으면 표시
          setShowInstruction(true);
        } else {
          // 지시사항이 없으면 바로 다음 페이지로 이동
          setCurrentPage(currentPage + 1);
        }
      }
    }
  };

  // 이전 페이지로 이동하는 함수
  const handlePreviousPage = () => {
    if (showInstruction) {
      // 지시사항 표시 중이면 이전 상태로 돌아감
      setShowInstruction(false);
    } else {
      if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  return (
    <div className="relative book-background-container flex flex-col items-center">
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
            <StoryDialogue storyData={storyData[currentPage]} />
          )}
          {showInstruction && storyData.length > 0 && (
            <div>
              <h2>지시사항</h2>
              <p>{storyData[currentPage].instruction}</p>
            </div>
          )}
          {storyData.length > 0 && (
            <MissionScreen storyData={storyData[currentPage]} />
          )}
        </div>

        {/* 우측 콘텐츠 */}
        <div className="flex flex-col w-full lg:w-[40%] space-y-4 pl-4">
          <VideoP1 />
          <VideoP2 />
        </div>
      </div>

      {/* 페이지 네비게이션 버튼 */}
      <div className="absolute inset-y-0 w-full flex justify-between items-center px-8">
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

// ZIP 파일에서 데이터 로딩 함수
const loadStoryDataFromZip = async () => {
  console.log("ZIP 파일 다운로드 시작");
  // ZIP 파일 URL
  const zipUrl = "https://ssafy-mongle.s3.ap-southeast-2.amazonaws.com/HanselAndGretelData_single.zip";

  // ZIP 파일 다운로드 및 해제
  const res = await fetch(zipUrl);
  console.log("ZIP 파일 다운로드 완료");
  const blob = await res.blob();
  console.log("ZIP 파일 해제 중...");
  const zip = await JSZip.loadAsync(blob); // JSZip 사용
  console.log("ZIP 파일 해제 완료");

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
  console.log("스토리 데이터 JSON 파일 읽기 완료");
  const storyJson = JSON.parse(storyText);

  // 이미지 및 오디오 URL 추가
  storyJson.forEach((page) => {
    page.image = fileMap[page.image];
    page.audio = fileMap[page.audio]; // 오디오 파일 경로 추가
    page.scriptFile = fileMap[page.scriptFile]; // 스크립트 파일 경로 추가
    page.instructionFile = fileMap[page.instructionFile]; // 지시사항 파일 경로 추가
  });

  // 스토리 데이터 반환
  console.log("스토리 데이터 반환 완료");
  return storyJson;
};

export default MultiPage;
