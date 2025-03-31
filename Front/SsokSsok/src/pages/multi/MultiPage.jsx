import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/book_background.css";
import StoryHeader from "../../components/StoryHeader";
import StoryIllustration from "../../components/story/StoryIllustration";
import StoryDialogue from "../../components/story/StoryDialogue";
import MissionScreen from "../../components/story/MissionScreen";
import PageNavigationButton from "../../components/story/PageNavigationButton";
import CompleteModal from "../../components/story/CompleteModal";
import PauseModal from "../../components/story/PauseModal";
import PhotoModal from "../../components/story/PhotoModal";
import JSZip from "jszip";
import VideoP1 from "../../components/multi/VideoP1";
import VideoP2 from "../../components/multi/VideoP2";
import WaitingModal from "../../components/multi/WaitingModal";

import { createProgressApi, updateProgressApi } from "../../apis/multiApi";
import { connectSocket, disconnectSocket, joinRoom, sendMessage, onSocketEvent, offSocketEvent } from "../../services/socket";


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

  const location = useLocation();
  const { roomId, friend, from, fairytale } = location.state || {};
  const [role, setRole] = useState(location.state?.role || null);

  const [showWaiting, setShowWaiting] = useState(from === "inviter");
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(from !== "inviter");
  const [showConfirmStartModal, setShowConfirmStartModal] = useState(false);
  const [pageIndex, setPageIndex] = useState(1); // 기본값 1 = 새로 읽기
  const [progressPk, setProgressPk] = useState(location.state?.progressPk || null);
  const [startReady, setStartReady] = useState(from !== "invitee"); // 초대한 쪽은 바로 시작

  const navigate = useNavigate();

  useEffect(() => {
    console.log("📦 location.state:", location.state); // 페이지 진입 시 상태 확인
  
    const index = location.state?.pageIndex;
    if (typeof index === "number" && index >= 1) {
      console.log("이어읽기 시작 페이지:", index); // 잘 받아왔는지 확인
      setPageIndex(index);
    }
  }, []);

  // 초대자 입장 시
  useEffect(() => {
    if (from !== "inviter" || !roomId || !role || !fairytale) return;
  
    connectSocket();               // 소켓 연결
    joinRoom(roomId);              // 방 조인
  }, [from, roomId, role, fairytale]);
  
  // 수락자 입장: 소켓 연결 + 방 입장 + 입장 알림
  useEffect(() => {
    if (from !== "invitee" || !roomId) return;

    connectSocket();
    joinRoom(roomId);
    sendMessage("inviteeJoined", { roomId });
  }, [from, roomId]);

  // 수락자: startInfo 수신
  useEffect(() => {
    if (from !== "invitee") return;
  
    onSocketEvent("sendStartInfo", ({ inviteeRole, pageIndex }) => {
      console.log("📦 역할/페이지 정보 수신:", inviteeRole, pageIndex);
      setRole(inviteeRole);
      setCurrentPage(pageIndex - 1); // 배열 인덱스 기준이라 -1 해줘야 원하는대로 작동함..
      setPageIndex(pageIndex);
      setStartReady(true); // 페이지 정보 수신 후 시작 가능 플래그 설정
    });
  
    return () => {
      offSocketEvent("sendStartInfo");
    };
  }, [from]);
  
  
  

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

          // ✅ 전체 sound 배열을 fileMap 경로로 매핑
          page.soundFiles = page.sound?.map((file) => fileMap[file]) || [];
        });

        setAssets(fileMap);
        setStoryData(storyJson);
      } catch (error) {
        console.error("데이터 로딩 에러:", error);
      }
    };

    loadStoryData();
  }, []);

  const handleNextPage = async () => {
    const currentData = storyData[currentPage];
    const nextPage = currentPage + 1;
  
    const shouldSave =
      location.state?.from === "inviter" &&
      !isMissionVisible &&
      progressPk;
  
    if (isMissionVisible) {
      // ✅ 미션 끝나고 페이지 넘기는 경우 —> 저장 OK
      setIsMissionVisible(false);
      setViewedMissions((prev) => ({ ...prev, [currentPage]: true }));
      setCurrentPage(nextPage);
  
      if (shouldSave) {
        await updateProgressApi(progressPk, {
          nowPage: nextPage,
          finish: false,
        });
        console.log("✅ 진행상황 업데이트 (미션 종료):", nextPage);
      }
    } else if (currentData.instructions && !viewedMissions[currentPage]) {
      // ✅ 미션 페이지 진입 → 저장 X
      setIsMissionVisible(true);
    } else {
      // ✅ 일반 페이지 → 저장 OK
      setCurrentPage(nextPage);
  
      if (shouldSave) {
        await updateProgressApi(progressPk, {
          nowPage: nextPage,
          finish: false,
        });
      }
    }
  };
  

  const handleInviteeJoined = async () => {
    sendMessage("sendStartInfo", {
      roomId,
      inviterRole: role,
      inviteeRole: role === fairytale.first ? fairytale.second : fairytale.first,
      pageIndex,
    });
  
    setShowWaiting(false);
    setShowConfirmStartModal(true);
  
    // ✅ 진행상황 생성은 오직 새로 읽기면서 pageIndex === 1일 때만!
    if (pageIndex === 1 && location.state?.from === "inviter" && !location.state?.isResume) {
        try {
          const res = await createProgressApi({
            mode: "MULTI",
            friendId: friend.friendId,
            nowPage: pageIndex,
            fairytalePk: fairytale.fairytalePk,
            role: role === fairytale.first ? "FIRST" : "SECOND",
          });

          const newPk = res.data?.data?.progressPk;
          if (newPk) {
            setProgressPk(newPk); // ✅ 상태 저장!
          }

          console.log("진행상황 등록 완료!");

      } catch (err) {
        console.error("❌ 진행상황 등록 실패:", err);
      }
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
      {showWaiting && (
        <WaitingModal
          mode="waiting"
          friend={friend}
          role={role}
          roomId={roomId}
          onTimeout={() => {
            alert("시간 초과로 연결이 종료되었습니다.");
            navigate("/main");
          }}
          onClose={(auto) => {
            if (auto) {
              // 상대방 입장 시 sendStartInfo 실행!
              handleInviteeJoined();
            } else {
              // 수동 취소
              const confirmed = window.confirm("함께 읽기 요청을 취소하시겠습니까?");
              if (confirmed) {
                navigate("/main");
              }
            }
          }}
          
        />
      )}

      {showConfirmStartModal && (
        <WaitingModal
          mode="confirmed"
          friend={friend}
          onClose={() => {
            setShowConfirmStartModal(false);
            setIsPhotoModalOpen(true);
          }}
        />
      )}

      {/* 진입 시 포토 모달 띄우기기 */}
      {isPhotoModalOpen && (
        <PhotoModal isOpen={isPhotoModalOpen} onClose={() => setIsPhotoModalOpen(false)} />
      )}

      
      <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 w-full flex justify-between px-8 z-40 pointer-events-none">
      <PageNavigationButton
          icon={previousIcon}
          altText="이전 페이지"
          onClick={handlePreviousPage}
          disabled={currentPage === 0 && !isMissionVisible}
          className="pointer-events-auto"
        />
        <PageNavigationButton
          icon={nextIcon}
          altText="다음 페이지"
          onClick={handleNextPage}
          disabled={currentPage === storyData.length - 1 && !isMissionVisible}
          className="pointer-events-auto"
        />
      </div>

      {/* 상단 텍스트 */}
      <StoryHeader />

      {/* 중앙 콘텐츠 */}
      <div className="flex w-full h-[75%] max-w-[1200px] px-4 lg:px-12">
      <div className="flex flex-col w-full lg:w-[60%] space-y-4 pr-4">
        {storyData.length > 0 && startReady && (
          <StoryIllustration storyData={storyData[currentPage]} />
        )}

        {!showWaiting && !isPhotoModalOpen && storyData.length > 0 && !isMissionVisible && startReady && (
          <StoryDialogue
            key={`dialogue-${currentPage}`}
            storyData={storyData[currentPage]}
            assets={assets}
          />
        )}

        {!isPhotoModalOpen && storyData.length > 0 && isMissionVisible && startReady && (
          <MissionScreen
            storyData={storyData[currentPage]}
            assets={assets}
          />
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
          className="fixed bottom-8 right-8 z-10 w-52 h-20 font-cafe24 text-xl hover:scale-110 transition-transform duration-200"
        >
          <img
            src={pauseButton}
            alt="그만 읽기"
            className="absolute inset-0 w-full h-full object-contain"
          />
          <span className="relative">
            {currentPage === storyData.length - 1 ? "읽기 완료" : "그만 읽기"}
          </span>
        </button>
      )}

    </div>
  );
}

export default MultiPage;