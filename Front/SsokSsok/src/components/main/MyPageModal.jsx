import React from "react";
import MyPageBoard from "../../assets/images/mypage_board_icon.png"
import MyFriendIcon from "../../assets/images/friend_icon.png"
import LogoutIcon from "../../assets/images/logout_icon.png"
import useAuthStore from "../../stores/authStore";

const MyPageModal = () => {
  const {logout} = useAuthStore()

  const handleLogout = () => {
    if (window.confirm("로그아웃갈비?")) {
      logout() // Zustand 상태 초기화 + 리다이렉트
    }
  }

  return (
    <div className="text-black text-xl text-center relative">
      <div className="inline-block relative">
      <img src={MyPageBoard} alt="MyPageBoard" className="w-[14rem] -mt-[21rem]"/>
      <img src={MyFriendIcon} alt="MyFriendIcon" className="w-[10rem] absolute top-1/2 left-full -translate-y-1/2 ml-2 -mt-[17rem]"/>
      </div>

      
      <div className="absolute bottom-[-16rem] left-1/2 -translate-x-1/2">
        <img
          src={LogoutIcon}
          alt="logoutIcon"
          className="w-[8rem] h-auto max-w-none transition-transform duration-200 hover:scale-110 cursor-pointer"
          onClick={handleLogout}
        />
      </div>
    </div>
  )
}

export default MyPageModal
