import React, { useState, useEffect, useCallback } from "react";
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
import WaitingModal from "../../components/multi/WaitingModal";
import JSZip from "jszip";
import VideoWithOverlay from "../../components/multi/VideoWithOverlay";
import CollectStoneOverlay from "../../components/multi/mission/CollectStoneOverlay.jsx";
import MissionRouter from "../../components/story/MissionRouter.jsx";
import IllustrationRouter from "../../components/story/IllustrationRouter.jsx";

import { createProgressApi, updateProgressApi } from "../../apis/multiApi";
import {
  connectSocket,
  disconnectSocket,
  joinRoom,
  sendMessage,
  onSocketEvent,
  offSocketEvent,
} from "../../services/socket";

import nextIcon from "../../assets/images/pagenext_icon.png";
import previousIcon from "../../assets/images/pageprevious_icon.png";
import pauseButton from "../../assets/images/btn_pause.png";

function MultiPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [storyData, setStoryData] = useState([]);
  const [assets, setAssets] = useState({});
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [isMissionVisible, setIsMissionVisible] = useState(false);
  const [viewedMissions, setViewedMissions] = useState({});
  const [statusContent, setStatusContent] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const location = useLocation();
  const { roomId, friend, from, fairytale } = location.state || {};
  const [role, setRole] = useState(location.state?.role || null);
  const [showWaiting, setShowWaiting] = useState(from === "inviter");
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(from !== "inviter");
  const [showConfirmStartModal, setShowConfirmStartModal] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [progressPk, setProgressPk] = useState(
    location.state?.progressPk || null
  );
  const [startReady, setStartReady] = useState(from !== "invitee");

  const navigate = useNavigate();

  const handleNextPage = useCallback(async () => {
    const currentData = storyData[currentPage];
    const nextPage = currentPage + 1;
    const shouldSave = from === "inviter" && !isMissionVisible && progressPk;


    
    if (isMissionVisible) {
      setIsMissionVisible(false);
      setViewedMissions((prev) => ({ ...prev, [currentPage]: true }));
      setCurrentPage(nextPage);
      setPageIndex(nextPage + 1);

      if (from === "inviter") {
        sendMessage("prevNext", { roomId, next: true, prev: false });
        if (shouldSave) {
          await updateProgressApi(progressPk, {
            nowPage: nextPage + 1,
            finish: false,
          });
          console.log("✅ 저장 완료 (미션 종료):", nextPage + 1);
        }
      }
      return;
    }

    const isMission = currentData.mission && !viewedMissions[currentPage];
    if (isMission) {
      setIsMissionVisible(true);
      if (from === "inviter") {
        sendMessage("prevNext", { roomId, next: true, prev: false });
      }
      return;
    }

    setCurrentPage(nextPage);
    setPageIndex(nextPage + 1);
    if (from === "inviter") {
      sendMessage("prevNext", { roomId, next: true, prev: false });
      if (shouldSave) {
        await updateProgressApi(progressPk, {
          nowPage: nextPage + 1,
          finish: false,
        });
        console.log("✅ 저장 완료 (일반):", nextPage + 1);
      }
    }
  }, [
    currentPage,
    from,
    isMissionVisible,
    viewedMissions,
    progressPk,
    storyData,
    roomId,
  ]);

  const handlePreviousPage = useCallback(() => {
    const prevPage = currentPage - 1;
    if (isMissionVisible) {
      setIsMissionVisible(false);
      setViewedMissions((prev) => ({ ...prev, [currentPage]: true }));
      setCurrentPage(prevPage);
      setPageIndex(prevPage + 1);
      if (from === "inviter") {
        sendMessage("prevNext", { roomId, next: false, prev: true });
      }
      return;
    }
    if (currentPage > 0) {
      setCurrentPage(prevPage);
      setPageIndex(prevPage + 1);
      if (from === "inviter") {
        sendMessage("prevNext", { roomId, next: false, prev: true });
      }
    }
  }, [currentPage, isMissionVisible, from, roomId]);

  useEffect(() => {
    const index = location.state?.pageIndex;
    if (typeof index === "number" && index >= 1) {
      setPageIndex(index);
      setCurrentPage(index - 1);
    }
  }, [location.state]);

  useEffect(() => {
    if (from !== "inviter" || !roomId || !role || !fairytale) return;
    connectSocket();
    joinRoom(roomId);
  }, [from, roomId, role, fairytale]);

  useEffect(() => {
    if (from !== "invitee" || !roomId) return;
    connectSocket();
    joinRoom(roomId);
    sendMessage("inviteeJoined", { roomId });
  }, [from, roomId]);

  useEffect(() => {
    if (from !== "invitee") return;
    onSocketEvent("sendStartInfo", ({ inviteeRole, pageIndex }) => {
      setRole(inviteeRole);
      setPageIndex(pageIndex);
      setCurrentPage(pageIndex - 1);
      setStartReady(true);
    });
    return () => offSocketEvent("sendStartInfo");
  }, [from]);

  useEffect(() => {
    const loadStoryData = async () => {
      try {
        const zipUrl =
          "https://ssafy-mongle.s3.ap-southeast-2.amazonaws.com/HanselAndGretelData_single.zip";
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
          page.soundFiles = page.sound?.map((file) => fileMap[file]) || [];

          if (page.mission) {
            page.mission.instructionsFile = fileMap[page.mission.instructions];
            page.mission.hintImageFile = page.mission.hintImage
              ? fileMap[page.mission.hintImage]
              : null;
            page.mission.instructionImagesFiles =
              page.mission.instructionImages?.map((img) => fileMap[img]) || [];
            page.mission.soundEffects =
              page.mission.soundEffect?.map((sound) => fileMap[sound]) || [];
          }
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
    if (from === "inviter") return;
    onSocketEvent("prevNext", async ({ next, prev }) => {
      if (next) await handleNextPage();
      if (prev) handlePreviousPage();
    });
    return () => offSocketEvent("prevNext");
  }, [from, handleNextPage, handlePreviousPage]);

  useEffect(() => {
    // currentPage 변경 시 statusContent 초기화 (이전 미션 UI 제거)
    setStatusContent(null);
  }, [currentPage]);

  const handleInviteeJoined = async () => {
    sendMessage("sendStartInfo", {
      roomId,
      inviterRole: role,
      inviteeRole:
        role === fairytale.first ? fairytale.second : fairytale.first,
      pageIndex,
    });
    setShowWaiting(false);
    setShowConfirmStartModal(true);

    if (
      pageIndex === 1 &&
      location.state?.from === "inviter" &&
      !location.state?.isResume
    ) {
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
  const currentMission = storyData[currentPage]?.mission;
  const currentMissionRole = storyData[currentPage]?.role;
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
              const confirmed = window.confirm(
                "함께 읽기 요청을 취소하시겠습니까?"
              );
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

      {isPhotoModalOpen && (
        <PhotoModal
          isOpen={isPhotoModalOpen}
          onClose={() => setIsPhotoModalOpen(false)}
        />
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

      <StoryHeader />

      <div className="flex w-full h-[75%] max-w-[1200px] px-4 lg:px-12">
        <div className="flex flex-col w-full lg:w-[60%] space-y-4 pr-4">
          {storyData.length > 0 && startReady && (
            <StoryIllustration storyData={storyData[currentPage]}>
              {isMissionVisible && currentMission?.type && (
                <IllustrationRouter
                  type={currentMission.type}
                  role={role}
                  missionRole={currentMissionRole}
                  missionData={currentMission}
                  assets={assets}
                  publisher={publisher}
                  onSuccess={() => {
                    setIsMissionVisible(false);
                    setViewedMissions((prev) => ({
                      ...prev,
                      [currentPage]: true,
                    }));
                  }}
                  roomId={roomId}
                  from={from}
                  setStatusContent={setStatusContent}
                />
              )}
            </StoryIllustration>
          )}
          {!showWaiting &&
            !isPhotoModalOpen &&
            storyData.length > 0 &&
            !isMissionVisible &&
            startReady && (
              <StoryDialogue
                key={`dialogue-${currentPage}`}
                storyData={storyData[currentPage]}
                assets={assets}
              />
            )}
          {!isPhotoModalOpen &&
            storyData.length > 0 &&
            isMissionVisible &&
            startReady && (
              <MissionScreen
                storyData={storyData[currentPage]}
                assets={assets}
                statusContent={statusContent}
              />
            )}
        </div>
        <div className="flex flex-col w-full lg:w-[40%] space-y-4 pl-4">
          <VideoWithOverlay roomId={roomId} userName={role}>
            {(pub) => {
              if (!publisher) setPublisher(pub);
              const mission = storyData[currentPage]?.mission;
              const missionRole = storyData[currentPage]?.role;
              return (
                isMissionVisible &&
                mission?.type && (
                  <MissionRouter
                    type={mission.type}
                    role={role}
                    missionRole={missionRole}
                    missionData={mission}
                    assets={assets}
                    publisher={pub}
                    onSuccess={() => {
                      setIsMissionVisible(false);
                      setViewedMissions((prev) => ({
                        ...prev,
                        [currentPage]: true,
                      }));
                   
                    }}
                    roomId={roomId}
                    from={from}
                    setStatusContent={setStatusContent}
                  />
                )
              );
            }}
          </VideoWithOverlay>
        </div>
      </div>

      {isCompleteModalOpen && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <CompleteModal />
        </div>
      )}
      {isPauseModalOpen && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <PauseModal />
        </div>
      )}
      {!isMissionVisible && (
        <button
          onClick={() => {
            if (currentPage === storyData.length - 1) {
              setIsCompleteModalOpen(true);
            } else {
              setIsPauseModalOpen(true);
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
