import React from "react";
import BeeAnimation from "../../components/animations/BeeAnimation";
import FlowerAnimation from "../../components/animations/FlowerAnimation";
import Header from "../../components/Header";
import { bookInfoApi } from "../../apis/bookStartApi";
import { useEffect, useState } from "react";
import HanselBoard from "../../assets/images/hansel_board.png";
import OpenBookImg from "../../assets/images/openbook.png";
import modeBoard from "../../assets/images/board1_icon.png";
import "./BookStartPage.css";
import continueBtn from "../../assets/images/again_icon.png";
import WoodTexture from "../../assets/images/wood_texture.png";
import { useNavigate } from "react-router-dom";
import RoleSelectModal from "../../components/multi/RoleSelectModal";
import FriendSelectModal from "../../components/multi/FriendSelectModal";
import InviteConfirmModal from "../../components/multi/InviteConfirmModal";
import WaitingModal from "../../components/multi/WaitingModal";
import { createSingleProgressApi } from "../../apis/singleApi";
import ContinueSingleModal from "../../components/story/ContinueSingleModal";

const BookStartPage = () => {
  const [bookData, setBookData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();
  const [multiStep, setMultiStep] = useState(null); // 'role' | 'friend' | 'confirm' | 'waiting' 등
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [showWaiting, setShowWaiting] = useState(false);

  const [showContinueModal, setShowContinueModal] = useState(false);
  const [selectedProgress, setSelectedProgress] = useState(null);

  const [selectedContinueProgress, setSelectedContinueProgress] = useState(null);
  const [showContinueConfirmModal, setShowContinueConfirmModal] = useState(false);

 
  
  useEffect(() => {
    bookInfoApi()
      .then((res) => {
        if (res.data.isSuccess) {
          console.log(res.data.data)
          setBookData(res.data.data)
        } else {
          setError("동화 정보를 불러오지 못했습니다.")
          console.error("📛 API 실패 응답:", res.data)
        }
      })
      .catch((err) => {
        setError("서버 오류가 발생했습니다.")
        console.error("❌ API 호출 오류:", err)
      })
      .finally(() => setLoading(false))
  }, []);

  if (loading) return <div className="text-white p-10">불러오는 중...</div>
  if (error) return <div className="text-red-500 p-10">{error}</div>
  if (!bookData) return null

  const { fairytale, progressList } = bookData
  const singleProgress = progressList.filter((p) => p.mode === "SINGLE")
  const multiProgress = progressList.filter((p) => p.mode === "MULTI")

  const handleClickContinueMulti = (progress) => {
    setSelectedProgress(progress);
    setShowContinueModal(true);
  };

  // 싱글 스토리 진행 시작 생성
  const handleStartSingle = async () => {
    try {
      const response = await createSingleProgressApi({
        mode: "SINGLE",
        friendId: null,
        nowPage: 1,
        fairytalePk: fairytale.fairytalePk,
        role: "FIRST",
      });
      console.log("api 응답 : ", response.data)
  
      if (response.data.isSuccess) {
        const progressPk = response.data.data;
        navigate("/single", {
          state: {
            progressPk,
            nowPage: 1,
            role: "FIRST",
            fairytale,
          },
        });
      } else {
        console.error("실패:", response.data);
      }
    } catch (error) {
      console.error("에러:", error);
    }
  };

  // 싱글 스토리 이어하기 핸들러 생성

  const handleConfirmContinue = () => {
    if (!selectedContinueProgress) return;
    navigate("/single", {
      state: {
        progressPk: selectedContinueProgress.progressPk,
        nowPage: selectedContinueProgress.nowPage,
        role: selectedContinueProgress.role,
        fairytale,
      },
    });
  };
  

  const handleClickContinueSingle = (progress) => {
    setSelectedContinueProgress(progress);
    setShowContinueConfirmModal(true); // 모달 열기
  };
  

  return (
    <>
      <BeeAnimation />
      <FlowerAnimation />
      <Header />
      <div className="background-container relative flex flex-col items-center">
        <img src={OpenBookImg} alt="openBook" className="w-[50rem]" />
        <img
          src={HanselBoard}
          alt="hanselBoard"
          className="absolute w-[18rem] top-[4%] left-[50%] -translate-x-1/2 z-10"
        />

        <div className="absolute top-[18%] w-[45rem] h-[30rem] flex z-20">
          {/* 싱글모드 */}
          <div className="w-1/2 h-full flex flex-col items-center">
            <h2 className="text-3xl font-whitechalk">혼자서도 즐겨요!</h2>
            <div className="relative group w-[15rem] mb-4 cursor-pointer"
             onClick={handleStartSingle}>
              <img src={modeBoard} alt="modeBoard" className="w-full transition shake-hover" />
              <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 font-whitechalk text-3xl text-white drop-shadow-md">
                싱글 모드
              </p>
            </div>
            {singleProgress.length > 0 ? (
              singleProgress.map((progress, idx) => (
                <div
                    key={idx}
                    style={{
                        backgroundImage: `url(${WoodTexture})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                    className="w-[63%] h-[5.5rem] flex flex-col items-center justify-center px-3 rounded-md shadow-md transition-transform duration-300 hover:scale-105"
                    >
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-black font-whitechalk text-xl">싱글 진행률</p>
                    <img 
                    src={continueBtn} 
                    alt="이어하기" 
                    className="w-[6rem] cursor-pointer"
                    onClick={() => handleClickContinueSingle(progress)}
                    />
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => {
                      const threshold = Math.ceil(fairytale.count / 5) * (i + 1);
                      const isFilled = progress.nowPage >= threshold;

                      // ✅ 최소 한 칸은 채워지도록
                      const isFirst = i === 0 && progress.nowPage > 0;

                      return (
                        <div
                          key={i}
                          className={`w-7 h-5 rounded-sm ${
                            isFilled || isFirst ? "bg-green-400" : "bg-red-400"
                          }`}
                        ></div>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <p className="font-whitechalk mt-2">싱글모드를 시작해보세요!</p>
            )}
          </div>

          {showContinueConfirmModal && (
            <ContinueSingleModal
              onConfirm={handleConfirmContinue}
              onCancel={() => setShowContinueConfirmModal(false)}
            />
          )}

          {/* 멀티모드 */}
          <div className="w-1/2 h-full flex flex-col items-center">
            <h2 className="text-3xl font-whitechalk">함께 즐겨요!</h2>
            <div
              className="relative group w-[15rem] mb-4 cursor-pointer"
              onClick={() => setMultiStep("role")}
            >
              <img src={modeBoard} alt="modeBoard" className="w-full transition shake-hover" />
              <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 font-whitechalk text-3xl text-white drop-shadow-md">
                멀티 모드
              </p>
            </div>
            {multiProgress.length > 0 ? (
              multiProgress.map((progress, idx) => (
                <div
                    key={idx}
                    style={{
                        backgroundImage: `url(${WoodTexture})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                    className="w-[63%] h-[6.5rem] flex flex-col items-center justify-center mb-3  px-3 rounded-md shadow-md transition-transform duration-300 hover:scale-105"
                    >
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-whitechalk text-xl text-black">{progress.friendNickname}님과</p>
                    <img src={continueBtn} alt="이어하기" className="w-[6rem] cursor-pointer" onClick={() => handleClickContinueMulti(progress)} />
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => {
                      const threshold = Math.ceil(fairytale.count / 5) * (i + 1);
                      const isFilled = progress.nowPage >= threshold;

                      // ✅ 최소 한 칸은 채워지도록
                      const isFirst = i === 0 && progress.nowPage > 0;

                      return (
                        <div
                          key={i}
                          className={`w-7 h-5 rounded-sm ${
                            isFilled || isFirst ? "bg-green-400" : "bg-red-400"
                          }`}
                        ></div>
                      );
                    })}
                  </div>

                </div>
              ))
            ) : (
              <p className="font-whitechalk mt-2">멀티모드를 시작해보세요!</p>
            )}
          </div>
        </div>
        {multiStep === "role" && (
          <RoleSelectModal
            roleOptions={{ first: fairytale.first, second: fairytale.second }}
            onSelect={(role) => {
              setSelectedRole(role);
              setMultiStep("friend");
            }}
            onClose={() => setMultiStep(null)}
          />
        )}

        {multiStep === "friend" && (
          <FriendSelectModal
            onSelectFriend={(friend) => {
              setSelectedFriend(friend);
              setMultiStep("confirm");
            }}
            onClose={() => setMultiStep(null)}
          />
        )}

        {multiStep === "confirm" && (
          <InviteConfirmModal
            friend={selectedFriend.friendId}
            nickname={
              selectedFriend.from === "friend"
                ? selectedFriend.nickname
                : selectedFriend.friendId
            }
            onConfirm={(roomId) => {
              navigate("/multi", {
                state: {
                  roomId,
                  role: selectedRole,
                  friend: selectedFriend,
                  from: "inviter",
                  fairytale,  // 동화책 정보 추가 전달
                },
              }); // ✅ 멀티 페이지 이동 + 데이터 전달
            }}
            onClose={() => setMultiStep(null)}
          />
        )}


        {multiStep === "waiting" && (
          <WaitingModal
            friend={selectedFriend}
            role={selectedRole}
            roomId={roomId}                   // 이걸 전달해줘야 소켓 연결 가능
            onTimeout={() => {
              alert("시간이 초과되어 초대가 취소되었습니다.");
              setMultiStep(null);
            }}
            onClose={() => setMultiStep(null)}
          />
        )}

        {showContinueModal && selectedProgress && (
          <InviteConfirmModal
            friend={selectedProgress.friendId}
            nickname={selectedProgress.friendNickname}
            mode="continue"
            onClose={() => setShowContinueModal(false)}
            onConfirm={(roomId) => {
              const role = selectedProgress.role === "FIRST" ? fairytale.first : fairytale.second;

              navigate("/multi", {
                state: {
                  roomId,
                  role,
                  friend: {
                    friendId: selectedProgress.friendId,
                    nickname: selectedProgress.friendNickname,
                  },
                  from: "inviter",
                  fairytale,
                  pageIndex: selectedProgress.nowPage,
                  isResume: true, // 이어 읽기라는 플래그 추가!
                  progressPk: selectedProgress.progressPk, // 진행상호아 pk 포함 전달
                },
              });
            }}
          />
        )}

      </div>
    </>
  )
}

export default BookStartPage