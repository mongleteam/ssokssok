import React, { useEffect, useState } from "react";
import MyPageBoard from "../../assets/images/mypage_board_icon.png";
import MyFriendIcon from "../../assets/images/friend_icon.png";
import LogoutIcon from "../../assets/images/logout_icon.png";
import useAuthStore from "../../stores/authStore";
import { mypageInfoApi } from "../../apis/myPageApi";

const MyPageModal = () => {
  const [myInfo, setMyInfo] = useState(null);
  const { logout } = useAuthStore();
  useEffect(() => { 
    const fetchMyInfo = async () => {
      try {
        const res = await mypageInfoApi();
        setMyInfo(res.data);
      } catch (err) {
        console.error("내 정보 조회 실패", err.response?.data || err.message);
      }
    };

    fetchMyInfo();
  }, []);

  const handleLogout = () => {
    if (window.confirm("로그아웃갈비?")) {
      logout();
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full text-black text-center font-ganpan">
      {/* 배경 속 보드 이미지 */}
      <div className="relative -mt-20 mb-16">
        <img src={MyPageBoard} alt="MyPageBoard" className="w-[14rem]" />
        <img
          src={MyFriendIcon}
          alt="MyFriendIcon"
          className="w-[9rem] absolute top-1/2 left-full -translate-y-[30%] ml-2"
        />
      </div>

      {/* 내 정보 텍스트 */}
      <div className="space-y-5 text-left text-3xl sm:text-4xl tracking-wide">
        <p>아이디: {myInfo?.data.id || "로딩 중..."}</p>
        <p className="whitespace-nowrap">이메일: {myInfo?.data.email || "로딩 중..."}</p>
        <p>
          닉네임: {myInfo?.data.nickname || "로딩 중..."}{" "}
          <button className="bg-white bg-opacity-80 text-black text-sm px-2 py-1 rounded-full ml-2 relative -top-1">수정</button>
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
