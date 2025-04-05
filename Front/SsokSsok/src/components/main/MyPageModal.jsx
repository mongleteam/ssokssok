import React, { useEffect, useState } from "react";
import MyPageBoard from "../../assets/images/mypage_board_icon.png";
import MyFriendIcon from "../../assets/images/friend_icon.png";
import LogoutIcon from "../../assets/images/logout_icon.png";
import useAuthStore from "../../stores/authStore";
import { deleteUserApi, mypageInfoApi, updateNicknameApi } from "../../apis/myPageApi";
import FriendModal from "./FriendModal";
import { useNavigate } from "react-router-dom";
import DeleteMemberIcon from "../../assets/images/delete_member_icon.png"
import {motion} from "framer-motion"
import CustomConfirm from "../CustomConfirm";
import CustomAlert from "../CustomAlert";

const MyPageModal = ({openModal}) => {
  const [myInfo, setMyInfo] = useState(null)
  const [editing, setEditing] = useState(false)
  const [nickname, setNickname] = useState("")
  const { logout } = useAuthStore()
  const navigate = useNavigate()
  const [runAwayPos, setRunAwayPos] = useState({ x: 0, y: 0 });
  const [runCount, setRunCount] = useState(0);
  const runDirections = [
    { x: -680, y: -450 }, // 왼쪽 위
    { x: 0, y: -450 },  // 오른쪽 위
    { x: -680, y: 0 },  // 왼쪽 아래
    { x: 0, y: 0 },   // 오른쪽 아래
  ];
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [alertMessage, setAlertMessage] = useState("")
  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => { 
    const fetchMyInfo = async () => {
      try {
        const res = await mypageInfoApi()
        setMyInfo(res.data)
        setNickname(res.data.data.nickname)
        // console.log(res.data.data.nickname)
      } catch (err) {
        // console.error("내 정보 조회 실패", err.response?.data || err.message);
      }
    }

    fetchMyInfo()
  }, [])

  const handleLogout = async () => {
    setShowLogoutConfirm(true); // 커스텀 confirm 모달 보여주기
  }

  const confirmLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("로그아웃 실패", err);
    } finally {
      setShowLogoutConfirm(false);
    }
  };
  
  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleNicknameSave = async () => {
    try {
      const res = await updateNicknameApi(nickname)
      // 성공한 경우
      setMyInfo((prev) => ({
        ...prev,
        data: { ...prev.data, nickname },
      }))
      setEditing(false);
      // ✅ 커스텀 Alert로 변경!
      setAlertMessage("닉네임이 수정되었습니다!");
      setShowAlert(true);
    } catch (err) {
      // 400 에러일 때 
      const errorMessage = err?.response?.data?.message || "닉네임 수정에 실패했습니다."
      alert(errorMessage)
      console.error("닉네임 수정 실패", err)
    }
  }

  // 회원탈퇴
  const handleDeleteUser = async () => {
    const confirmed = window.confirm("정말 탈퇴하시겠습니까? 🥲")
  
    if (!confirmed) return
  
    try {
      await deleteUserApi()
      alert("회원 탈퇴가 완료되었습니다.")
  
      // 전역 상태 초기화 (Zustand)
      useAuthStore.getState().logout()
  
      // 초기화면으로 이동
      navigate("/")
    } catch (error) {
      console.error(error)
      alert("회원 탈퇴에 실패했습니다.")
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

      <motion.img
        src={DeleteMemberIcon}
        alt="deleteMemberIcon"
        className="absolute w-[9rem] h-auto max-w-none cursor-pointer"
        style={{ bottom: "1.5rem", right: "1.5rem" }}
        animate={{ x: runAwayPos.x, y: runAwayPos.y }}
        transition={{ type: "spring", stiffness: 500, damping: 15 }}
        onMouseEnter={() => {
          if (runCount >= 4) return; // 4번까지 도망가고 그 뒤로는 멈춤
          setRunAwayPos(runDirections[runCount]);
          setRunCount((prev) => prev + 1);
        }}
        onClick={handleDeleteUser}
      />


    {showLogoutConfirm && (
      <CustomConfirm
        message="로그아웃갈비? 🥩"
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    )}

    {showAlert && (
      <CustomAlert
        message={alertMessage}
        onClose={() => setShowAlert(false)}
      />
    )}
    </div>
  );
};

export default MyPageModal;
