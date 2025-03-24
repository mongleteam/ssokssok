import React from "react";
import MyPageBoard from "../../assets/images/mypage_board_icon.png"
import MyFriendIcon from "../../assets/images/friend_icon.png"


const MyPageModal = () => {
  return (
    <div className="text-black text-xl text-center relative">
      <div className="inline-block relative">
      <img src={MyPageBoard} alt="MyPageBoard" className="w-[14rem] -mt-[21rem]"/>
      <img src={MyFriendIcon} alt="MyFriendIcon" className="w-[10rem] absolute top-1/2 left-full -translate-y-1/2 ml-2 -mt-[17rem]"/>
      </div>
    </div>
  )
}

export default MyPageModal
