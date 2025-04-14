import React, { useState, useEffect, useCallback, useRef } from "react";
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
import MissionRouter from "../../components/story/MissionRouter.jsx";
import IllustrationRouter from "../../components/story/IllustrationRouter.jsx";
import { getFromIndexedDB } from "../../utils/indexedDbUtils";
import PageAlert from "../../components/multi/PageAlert.jsx";
import ManualCaptureButton from "../../components/multi/ManualCaptureButton";

import { createProgressApi, updateProgressApi } from "../../apis/multiApi";
import { cancelGameApi } from "../../apis/FriendApi";
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
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [showConfirmStartModal, setShowConfirmStartModal] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [progressPk, setProgressPk] = useState(
    location.state?.progressPk || null
  );
  const [startReady, setStartReady] = useState(from !== "invitee");
  const [missionSuccessMap, setMissionSuccessMap] = useState({
    inviter: false,
    invitee: false,
  });
  const [peerStones, setPeerStones] = useState([]);
  const [stoneImage, setStoneImage] = useState(null); // ← assets에서 꺼내놓기
  const [peerCookieCount, setPeerCookieCount] = useState(0);
  const [isPeerFreed, setIsPeerFreed] = useState(false);
  const hasMountedRef = useRef(false);
  const previousPath = useRef(location.pathname);
  const [showPageAlert, setShowPageAlert] = useState(false);
  const [peerCleanCount, setPeerCleanCount] = useState(0);
  const [missionClearedAlert, setMissionClearedAlert] = useState(false);
  const captureRef = useRef();
  const [isTtsEnabled, setIsTtsEnabled] = useState(true); // 기본값은 자동 재생 ON


  const navigate = useNavigate();

  const handleNextPage = useCallback(async () => {
    const currentData = storyData[currentPage];
    const nextPage = currentPage + 1;
    const shouldSave = from === "inviter" && !isMissionVisible && progressPk;
    const shouldSaveOnMissionEnd = from === "inviter" && progressPk;
    const currentMissionRole = currentData?.role;

    // 역할 조건에 따라 성공 여부 판별
    const missionCleared = (() => {
      switch (currentMissionRole) {
        case 1: // 헨젤만
          return role === "헨젤"
            ? missionSuccessMap.inviter
            : missionSuccessMap.invitee;
        case 2: // 그레텔만
          return role === "그레텔"
            ? missionSuccessMap.inviter
            : missionSuccessMap.invitee;
        case 3: // 둘 다 해야 함
        default:
          return missionSuccessMap.inviter && missionSuccessMap.invitee;
      }
    })();

    // 미션 성공해야 다음 페이지 버튼 활성화
    if (isMissionVisible && from === "inviter") {
      if (!missionCleared) {
        alert("아직 미션이 끝나지 않았어요. 완료하고 넘어가볼까요?");
        return;
      }
    }

    // 미션 종료 처리
    if (isMissionVisible) {
      setIsMissionVisible(false);
      setViewedMissions((prev) => ({ ...prev, [currentPage]: true }));
      setCurrentPage(nextPage);
      setPageIndex(nextPage + 1);

      if (from === "inviter") {
        sendMessage("prevNext", { roomId, next: true, prev: false });
        if (shouldSaveOnMissionEnd) {
          // console.log("📝 진행상황 저장 시도 (미션 종료):", progressPk);
          await updateProgressApi(progressPk, {
            nowPage: nextPage + 1,
            finish: false,
          });
          // console.log("✅ 저장 완료 (미션 종료):", nextPage + 1);
        }
      }
      return;
    }

    // 새로운 미션 진입
    const isMission = currentData.mission && !viewedMissions[currentPage];
    if (isMission) {
      setIsMissionVisible(true);
      setMissionSuccessMap({ inviter: false, invitee: false }); // 🎯 성공 상태 초기화!
      if (from === "inviter") {
        sendMessage("prevNext", { roomId, next: true, prev: false });
      }
      return;
    }

    // 일반 페이지 이동
    setCurrentPage(nextPage);
    setPageIndex(nextPage + 1);
    if (from === "inviter") {
      sendMessage("prevNext", { roomId, next: true, prev: false });
      if (shouldSave) {
        await updateProgressApi(progressPk, {
          nowPage: nextPage + 1,
          finish: false,
        });
        // console.log("✅ 저장 완료 (일반):", nextPage + 1);
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
    missionSuccessMap, // ⚠️ 상태 쓰고 있으니 이거도 의존성에 꼭!
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
    onSocketEvent("isSuccess", ({ senderName, isSuccess }) => {
      // console.log("📩 isSuccess 이벤트 수신:", { senderName, isSuccess });

      setMissionSuccessMap((prev) => {
        const key = senderName === role ? "inviter" : "invitee";
        const updated = { ...prev, [key]: isSuccess === "성공" };

        // 🔍 여기서 조건 판단!
        const currentMission = storyData[currentPage]?.mission;
        const currentMissionRole = storyData[currentPage]?.role;

        const isMissionComplete = (() => {
          switch (currentMissionRole) {
            case 1:
              return role === "헨젤" ? updated.inviter : updated.invitee;
            case 2:
              return role === "그레텔" ? updated.inviter : updated.invitee;
            case 3:
            default:
              return updated.inviter && updated.invitee;
          }
        })();

        // ✅ 미션 성공 상태면 알림 보여주기
        if (isMissionVisible && isMissionComplete) {
          setMissionClearedAlert(true);
        }

        return updated;
      });

      // 열쇠 미션 처리 유지
      const currentMission = storyData[currentPage]?.mission;
      const isNotMe = senderName !== role;

      if (
        isSuccess === "성공" &&
        isNotMe &&
        isMissionVisible &&
        currentMission?.type === "webcam-getkey-multi"
      ) {
        setIsPeerFreed(true);
      }
    });

    return () => {
      offSocketEvent("isSuccess");
    };
  }, [role, currentPage, storyData, isMissionVisible]);

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

  // 브라우저 새로고침/닫기 대비
  useEffect(() => {
    const handleBeforeUnload = () => {
      sendMessage("leaveGame", { roomId, username: role });
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [roomId, role]);

  // 진짜 페이지 전환(언마운트)일 때만 leaveGame
  // useEffect(() => {
  //   return () => {
  //     const leavingPage = previousPath.current !== location.pathname;
  //     if (leavingPage && roomId && role) {
  //       sendMessage("leaveGame", { roomId, username: role });
  //       disconnectSocket();
  //     }
  //   };
  // }, [location.pathname]);

  // useEffect(() => {
  //   previousPath.current = location.pathname;
  // }, [location.pathname]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ""; // 크롬용: 사용자에게 새로고침 경고
      // 이건 실제 이동은 안 막고 경고창만 띄움
    };

    const handleReload = () => {
      alert("새로고침은 지원되지 않아요. 메인으로 돌아갑니다!");
      navigate("/main");
    };

    // 경고용
    window.addEventListener("beforeunload", handleBeforeUnload);
    // 진짜 새로고침 시점에 처리
    window.addEventListener("load", handleReload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("load", handleReload);
    };
  }, []);

  useEffect(() => {
    const loadStoryData = async () => {
      try {
        const ZIP_KEY = "HanselAndGretel_ZIP"; // 캐시키

        let zipBlob = await getFromIndexedDB(ZIP_KEY);

        if (!zipBlob) {
          console.error(
            "❌ ZIP 파일이 IndexedDB에 없습니다. MainPage에서 preload가 안 된 것 같아요."
          );
          return;
        }
        const zip = await JSZip.loadAsync(zipBlob);

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

  useEffect(() => {
    onSocketEvent("leaveGame", ({ username, exitMessage }) => {
      alert(exitMessage || `${username} 님이 연결을 종료했습니다.`);
      disconnectSocket(); // 연결 정리
      navigate("/main"); // 메인으로 이동
    });

    return () => {
      offSocketEvent("leaveGame");
    };
  }, []);

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
        const newPk = res.data?.data;

        if (newPk) {
          setProgressPk(newPk); // ✅ 상태 저장!
          // console.log("✅ 진행상황 pk 받아오기 완!", newPk);
        }
        // console.log("진행상황 등록 완료!");
      } catch (err) {
        // console.error("❌ 진행상황 등록 실패:", err);
      }
    }
  };
  const currentMission = storyData[currentPage]?.mission;
  const currentMissionRole = storyData[currentPage]?.role;

  useEffect(() => {
    const handleCleanCount = (data) => {
      const { senderName, objectCount } = data;

      if (
        senderName !== role &&
        currentPage === 30 &&
        isMissionVisible &&
        currentMission?.type === "webcam-clean-multi"
      ) {
        // console.log("[CLEAN] 31페이지에서 objectCount 수신:", objectCount);
        setPeerCleanCount(objectCount);
      }
    };

    onSocketEvent("objectCount", handleCleanCount);
    return () => offSocketEvent("objectCount", handleCleanCount);
  }, [role, currentPage, isMissionVisible, currentMission]);

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
                cancelGameApi(friend.friendId);
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
            // setIsPhotoModalOpen(true);
          }}
        />
      )}

      {/* {isPhotoModalOpen && (
        <PhotoModal
          isOpen={isPhotoModalOpen}
          onClose={() => setIsPhotoModalOpen(false)}
        />
      )} */}

      <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 w-full flex justify-between px-8 z-40 pointer-events-none">
        <PageNavigationButton
          icon={previousIcon}
          altText="이전 페이지"
          onClick={() => {
            if (from !== "inviter") {
              setShowPageAlert(true);
              return;
            }
            handlePreviousPage();
          }}
          disabled={currentPage === 0 && !isMissionVisible}
          className="pointer-events-auto"
        />
        <PageNavigationButton
          icon={nextIcon}
          altText="다음 페이지"
          onClick={() => {
            if (from !== "inviter") {
              setShowPageAlert(true);
              return;
            }
            handleNextPage();
          }}
          disabled={currentPage === storyData.length - 1 && !isMissionVisible}
          className={`pointer-events-auto ${
            isMissionVisible &&
            from === "inviter" &&
            missionSuccessMap.inviter &&
            missionSuccessMap.invitee
              ? "animate-blinkTwice"
              : ""
          }`}
        />
      </div>

      <StoryHeader />
      {/* <buttonnmn*
        onClick={() => setIsTtsEnabled((prev) => !prev)}
        className="absolute text-3xl top-5 right-20 px-4 py-2 rounded z-20"
      >
        {isTtsEnabled ? "🔊" : "🔇"}
      </buttonnmn*> */}


      <div className="flex w-full h-[75%] max-w-[1200px] px-4 lg:px-12">
      {/* <ManualCaptureButton captureTargetRef={captureRef}/> */}
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
                isTtsEnabled={isTtsEnabled} // 🔥 상태 전달!'
                setIsTtsEnabled={setIsTtsEnabled}
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
                setStatusContent={setStatusContent}
                userName={role}
              />
            )}
        </div>
        <div className="relative flex flex-col w-full lg:w-[40%] pl-4">
          <ManualCaptureButton captureTargetRef={captureRef} />
          <div ref={captureRef}>
          <VideoWithOverlay
            roomId={roomId}
            userName={role}
            peerOverlay={(sub, overlayRef) => {
              const width = overlayRef?.current?.offsetWidth || 640;
              const height = overlayRef?.current?.offsetHeight || 480;

              return (
                <>
                  {/* 돌 미션용 */}
                  {isMissionVisible &&
                    currentMission?.type === "webcam-collect-stone-multi" &&
                    peerStones.map((stone) => (
                      <img
                        key={`peer-stone-${stone.id}`}
                        src={stoneImage}
                        alt="peer-stone"
                        className="absolute w-12 h-12 z-10 opacity-90"
                        style={{
                          left: `${stone.x * width}px`,
                          top: `${stone.y * height}px`,
                          transform: "translate(-50%, -50%)",
                        }}
                      />
                    ))}

                  {/* 쿠키 미션용 */}
                  {isMissionVisible &&
                    currentMission?.type === "webcam-eatcookie" &&
                    currentMission.instructionImages?.length > 0 &&
                    peerCookieCount <
                      currentMission.instructionImages.length && (
                      <img
                        key="peer-cookie"
                        src={
                          assets[
                            currentMission.instructionImages[
                              Math.min(
                                peerCookieCount,
                                currentMission.instructionImages.length - 1
                              )
                            ]
                          ]
                        }
                        alt="peer-cookie"
                        className="absolute w-24 h-24 z-10 opacity-80"
                        style={{
                          left: "50%",
                          top: "50%",
                          transform: "translate(-50%, -50%)",
                        }}
                      />
                    )}

                  {/* 감옥(창살) 미션용 */}
                  {isMissionVisible &&
                    currentMission?.type === "webcam-getkey-multi" &&
                    role === "그레텔" &&
                    !isPeerFreed &&
                    currentMission.instructionImages?.[0] && (
                      <img
                        key="peer-jail"
                        src={assets[currentMission.instructionImages[0]]}
                        alt="peer-jail"
                        className="absolute inset-0 w-full h-full object-cover z-30 pointer-events-none opacity-90"
                      />
                    )}

                  {/* 청소 미션용 */}
                  {isMissionVisible &&
                    currentMission?.type === "webcam-clean-multi" &&
                    currentMission.instructionImages?.length >= 4 && // 0: 빗자루, 1~3: dust
                    peerCleanCount < 3 &&
                    role === "헨젤" && (
                      <img
                        key="peer-dust"
                        src={
                          assets[
                            currentMission.instructionImages[3 - peerCleanCount] // 0회면 3번, 1회면 2번, ...
                          ]
                        }
                        alt="peer-dust"
                        className="absolute top-20 right-0 w-[10rem] z-10 opacity-80"
                      />
                    )}
                </>
              );
            }}
          >
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
                      setViewedMissions((prev) => ({
                        ...prev,
                        [currentPage]: true,
                      }));
                    }}
                    roomId={roomId}
                    from={from}
                    setStatusContent={setStatusContent}
                    setPeerStones={setPeerStones}
                    setStoneImage={setStoneImage}
                    setPeerCookieCount={setPeerCookieCount}
                    setPeerCleanCount={setPeerCleanCount}
                  />
                )
              );
            }}
          </VideoWithOverlay>
          </div>
        </div>
      </div>

      {isCompleteModalOpen && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <CompleteModal />
        </div>
      )}
      {isPauseModalOpen && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <PauseModal roomId={roomId} userName={role} />
        </div>
      )}
      {showPageAlert && (
        <PageAlert
          message="먼저 초대한 친구가 넘겨줄 때까지 기다려주세요!"
          onClose={() => setShowPageAlert(false)}
        />
      )}
      {missionClearedAlert && (
        <PageAlert
          message="🎉 미션 성공! 다음 페이지로 넘어가세요!"
          onClose={() => setMissionClearedAlert(false)}
        />
      )}

      {!isMissionVisible && (
        <button
          onClick={async () => {
            if (currentPage === storyData.length - 1) {
              if (from === "inviter" && progressPk) {
                try {
                  await updateProgressApi(progressPk, {
                    nowPage: pageIndex,
                    finish: true,
                  });
                  // console.log("✅ 읽기 완료 처리 완");
                } catch (err) {
                  // console.error("❌ 읽기 완료 처리 실패:", err);
                }
              }
              sendMessage("leaveGame", { roomId, username: role });
              disconnectSocket();
              setIsCompleteModalOpen(true);
            } else {
              setIsPauseModalOpen(true);
            }
          }}
          className="fixed bottom-2 right-8 z-10 w-52 h-20 font-cafe24 text-xl hover:scale-110 transition-transform duration-200"
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
