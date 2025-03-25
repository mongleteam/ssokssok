import React, { useEffect, useState } from "react";
import AlarmBoard from "../../assets/images/alarm_board_icon.png"
import { notiListApi } from "../../apis/notificationApi";
import NotificationBoard from "../../assets/images/alarm_board_img.png"
import CheckIcon from "../../assets/images/check_icon.png"
import DeleteIcon from "../../assets/images/remove_icon.png"
import { acceptFriendApi, rejectFriendApi } from "../../apis/FriendApi";

const AlarmModal = () => {

  const [myAlarm, setMyAlarm] = useState([])
  useEffect(() => {
    const fetchMyAlarm = async () => {
      try {
        const res = await notiListApi()
        setMyAlarm(res.data.data.notifications)
      } catch (err) {
        console.error("알람 조회 실패", err)
      }
    }
    fetchMyAlarm()
  }, []) // [] 두번째 인자 없으면 무한 불러옴 -> 막힘 (중요)

  const getMessage = (item) => {
    switch(item.state) {
      case "friend":
        return `${item.friendId}님이 친구 요청을 보냈습니다`
      case "multi":
        return `${item.friendId}님이 동화에 초대했습니다.`
      default:
        return "알 수 없는 알림입니다."
    }
  }

  // 친구 수락, 동화 수락
    const handleAccept = async (item) => {
      try {
        if (item.state === "friend") {
          await acceptFriendApi(item.friendId)
          console.log("친구 요청 수락 완료")
        } else if (item.state === "multi") {
          console.log("게임 초대 수락 (API 아직 없음)", item.friendId)
        }
        // 수락 후 UI에서 알림 제거
        setMyAlarm(prev => prev.filter((_, i) => i !== item.index))
      } catch (err) {
        console.error("수락 실패", err)
      }
    }

    const handleReject = async (item) => {
      try {
        if (item.state === "friend") {
          await rejectFriendApi(item.friendId)
          console.log("친구 요청 거절 완료")
        } else if (item.state === "multi") {
          console.log("게임 초대 거절 (API 아직 없음)", item.friendId)
        }
        setMyAlarm(prev => prev.filter((_, i) => i !== item.index))
      } catch (err) {
        console.error("거절 실패", err)
      }
    }

  return (
    <div className="text-black text-xl text-center relative">
      {/* 알림함보드 */}
      <img src={AlarmBoard} alt="alarmBoard" className="w-[14rem] -mt-[20.5rem]"/>

      <div className="absolute left-1/2 -translate-x-1/2 space-y-1 w-[38rem] max-h-[20rem] overflow-y-auto mt-1">
      {myAlarm.length > 0 ? (
        myAlarm.map((item, index) => (
          <div
            key={index}
            className="w-full h-[5rem] bg-no-repeat bg-[length:100%_100%] bg-center flex justify-between items-center px-6"
            style={{
              backgroundImage: `url(${NotificationBoard})`,
            }}
          >
            <div className="text-2xl text-left whitespace-nowrap overflow-hidden text-ellipsis flex-1 mr-4 font-dodam font-bold">
              {getMessage(item)}
            </div>
            <div className="flex space-x-2 w-[5rem] shrink-0">
              <img src={CheckIcon} alt="accept" className="w-10 h-10 cursor-pointer" onClick={() => handleAccept({ ...item, index })}/>
              <img src={DeleteIcon} alt="reject" className="w-10 h-10 cursor-pointer" onClick={() => handleReject({ ...item, index })}/>
            </div>
          </div>
        ))
      ) : (
        <p className="text-3xl font-whitechalk text-gray-600 text-center pt-8">알림이 없습니다!</p>
      )}
    </div>
     


    </div>
  )
}

export default AlarmModal
