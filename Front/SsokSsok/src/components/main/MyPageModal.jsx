import React, { useEffect, useState } from "react";
import MyPageBoard from "../../assets/images/mypage_board_icon.png";
import MyFriendIcon from "../../assets/images/friend_icon.png";
import LogoutIcon from "../../assets/images/logout_icon.png";
import useAuthStore from "../../stores/authStore";
import { mypageInfoApi, updateNicknameApi } from "../../apis/myPageApi";
import FriendModal from "./FriendModal";

const MyPageModal = ({openModal}) => {
  const [myInfo, setMyInfo] = useState(null)
  const [editing, setEditing] = useState(false)
  const [nickname, setNickname] = useState("")
  const { logout } = useAuthStore()

  useEffect(() => { 
    const fetchMyInfo = async () => {
      try {
        const res = await mypageInfoApi()
        setMyInfo(res.data)
        setNickname(res.data.data.nickname)
        console.log(res.data.data.nickname)
      } catch (err) {
        console.error("내 정보 조회 실패", err.response?.data || err.message);
      }
    }

    fetchMyInfo()
  }, [])

  const handleLogout = async () => {
    if (window.confirm("로그아웃갈비?")) {
      await logout()
    }
  }

  const handleNicknameSave = async () => {
    try {
      const res = await updateNicknameApi(nickname)
      // 성공한 경우
      setMyInfo((prev) => ({
        ...prev,
        data: { ...prev.data, nickname },
      }))
      setEditing(false);
      alert("닉네임이 수정되었습니다!")
    } catch (err) {
      // 400 에러일 때 백엔드가 보내주는 message 표시
      const errorMessage = err?.response?.data?.message || "닉네임 수정에 실패했습니다."
      alert(errorMessage)
      console.error("닉네임 수정 실패", err)
    }
  }
  
  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full text-black text-center font-whitechalk">
      {/* 배경 속 보드 이미지 */}
      <div className="relative -mt-20 mb-16">
        <img src={MyPageBoard} alt="MyPageBoard" className="w-[14rem]" />
        <img
          src={MyFriendIcon}
          alt="MyFriendIcon"
          onClick={() => openModal(FriendModal)}
          className="w-[9rem] absolute top-1/2 left-full -translate-y-[30%] ml-2 hover:scale-110 cursor-pointer"
        />
      </div>

  {/* 내 정보 텍스트 */}
  <div className="space-y-5 text-left text-3xl sm:text-4xl tracking-wide">
        <p>아이디: {myInfo?.data.id || "로딩 중..."}</p>
        <p className="whitespace-nowrap">이메일: {myInfo?.data.email || "로딩 중..."}</p>
        <p className="flex items-center gap-2">
          닉네임:&nbsp;
          {editing ? (
            <>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="text-2xl px-2 py-1 rounded border border-gray-400"
              />
              <button
                onClick={handleNicknameSave}
                className="bg-green-500 text-white text-lg px-3 py-1 rounded-full"
              >
                확인
              </button>
              <button
                onClick={() => {
                  setNickname(myInfo?.data.nickname);
                  setEditing(false);
                }}
                className="bg-red-400 text-white text-lg px-3 py-1 rounded-full"
              >
                취소
              </button>
            </>
          ) : (
            <>
              {myInfo?.data.nickname || "로딩 중..."}
              <button
                className="bg-white bg-opacity-80 text-black text-lg px-2 py-1 rounded-full ml-2 relative -top-1"
                onClick={() => setEditing(true)}
              >
                수정
              </button>
            </>
          )}
        </p>
      </div>

      {/* 로그아웃 버튼 */}
      <div className="mt-10">
        <img
          src={LogoutIcon}
          alt="logoutIcon"
          className="w-[9rem] h-auto max-w-none transition-transform duration-200 hover:scale-110 cursor-pointer"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};

export default MyPageModal;
