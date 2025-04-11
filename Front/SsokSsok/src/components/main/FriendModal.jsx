import React, { useState, useEffect } from "react";
import { deleteFriendApi, myFriendApi, plusFriendApi, searchFriendApi } from "../../apis/FriendApi";
import checkIcon from "../../assets/images/check_icon.png"
import boardImage from "../../assets/images/friend_board.png"
import plusIcon from "../../assets/images/plus_icon.png"
import DeleteIcon from "../../assets/images/remove_icon.png"
import CustomAlert from "../CustomAlert";
import CustomConfirm from "../CustomConfirm";
const FriendModal = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [myFriend, setMyFriend] = useState([])
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState("");
    const [onConfirmDelete, setOnConfirmDelete] = useState(() => () => {});

    useEffect(() => {
        const fetchMyFriend = async () => {
            try {
                const res = await myFriendApi()
                // console.log(res.data.data.friendList)
                setMyFriend(res.data.data.friendList)
            } catch (err) {
                // console.error("친구 조회 실패", err)
            }
        }
        fetchMyFriend()
    }, [])

    const handleSearch = async () => {
        if (!searchTerm.trim()) return
        try {
            const res = await searchFriendApi(searchTerm)
            setSearchResults(res.data)
          } catch (err) {
            // console.error("친구 검색 실패:", err)
            setSearchResults([])
          }
    }

    const handleAddFriend = async (friendID) => {
        try {
            await plusFriendApi(friendID)
            setAlertMessage(`${friendID} 아이디로 친구 요청을 보냈습니다 !`)
            setShowAlert(true);
        } catch (err) {
            // console.error("친구 추가 실패 : ", err)
            setAlertMessage("친구 추가 요청에 실패했습니다")
            setShowAlert(true);
        }
    }

    const handleDeleteFriend = (friendId, friendNickname) => {
        setConfirmMessage(`${friendNickname}님을 삭제하시겠습니까?`);
        setShowConfirm(true);
        setOnConfirmDelete(() => async () => {
          try {
            await deleteFriendApi(friendId);
            setAlertMessage(`${friendNickname}님이 삭제되었습니다!`);
            setShowAlert(true);
            setMyFriend(prev => prev.filter(friend => friend.friendId !== friendId));
          } catch (err) {
            setAlertMessage("친구 삭제에 실패했습니다.");
            setShowAlert(true);
          } finally {
            setShowConfirm(false); // 모달 닫기
          }
        });
      };
      

    return (
        <div className="flex w-full h-full font-whitechalk text-black text-2xl sm:text-3xl md:text-3xl lg:text-4xl tracking-wide">
            {/* 왼쪽 */}
            <div className="w-1/2 flex flex-col items-center justify-start pt-20">
                <h2>내 친구 목록</h2>
                <div className="grid grid-cols-2 gap-x-3 w-[23rem] ml-10 mt-4">
                    {myFriend.map((friend, index) => (
                        <div
                        
                        key={index}
                        className="w-full h-[4rem] bg-no-repeat bg-contain bg-center flex justify-between items-center px-4"
                        style={{
                            backgroundImage: `url(${boardImage})`,
                        }}
                        >
                        <span className="font-dodam text-2xl font-bold">{friend.friendNickname}</span>
                        <img src={DeleteIcon} alt="삭제" className="w-9 h-9 cursor-pointer" 
                        onClick={() => handleDeleteFriend(friend.friendId, friend.friendNickname)}/>
                        </div>
                    ))}
                </div>

            </div>

        {/* 가운데 선 */}
        <div className="w-[2px] h-[85%] bg-[#d6b98c] mx-4 mt-11" />

        {/* 오른쪽 */}
        <div className="flex-1 flex flex-col items-center justify-start pt-20">
            <h2>친구 추가하기</h2>
              {/* 검색창 */}
                <div className="flex mt-6 w-full max-w-[80%]">
                    <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="친구 아이디를 검색하세요"
                    className="flex-1 border-2 border-[#d6b98c] rounded px-4 py-2 text-xl"
                    />
                    <img
                    src={checkIcon}
                    alt="검색"
                    onClick={handleSearch}
                    className="ml-2 w-[2.5rem] h-auto cursor-pointer object-contain"
                    />
                </div>

                {/* 검색 결과 */}
                <div className="flex flex-wrap gap-2 mt-6 justify-center w-full">
                {searchResults.length > 0 ? (
                    searchResults.map((friendId) => (
                    <div
                        key={friendId}
                        className="relative w-[10rem] h-[4rem] bg-no-repeat bg-contain bg-center"
                        style={{ backgroundImage: `url(${boardImage})` }}
                    >
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black text-xl font-ganpan">
                        {friendId}
                        </span>
                        <img
                        src={plusIcon}
                        alt="추가"
                        className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 cursor-pointer"
                        onClick={() => handleAddFriend(friendId)}
                        />
                    </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-2xl font-whitechalk mt-4">검색 결과가 없습니다.</p>
                )}
                </div>

            </div>

            {showAlert && (
                <CustomAlert
                    message={alertMessage}
                    onClose={() => setShowAlert(false)}
                />
                )}
            {showConfirm && (
                <CustomConfirm
                    message={confirmMessage}
                    onConfirm={onConfirmDelete}
                    onCancel={() => setShowConfirm(false)}
                />
                )}

        </div>
    )
}

export default FriendModal