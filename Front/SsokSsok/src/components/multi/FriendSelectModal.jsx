import React, { useState, useEffect } from "react";
import closeIcon from "../../assets/images/remove_icon.png";
import modalBg from "../../assets/images/board3.png";
import searchIcon from "../../assets/images/search_icon.png";
import { searchFriendApi, myFriendApi } from "../../apis/FriendApi";

const FriendSelectModal = ({ onSelectFriend, onClose }) => {
  const [searchInput, setSearchInput] = useState("");
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friendList, setFriendList] = useState([]);
  const [searchResultList, setSearchResultList] = useState([]);
  
  //   const friendList = ["애옹", "냐옹", "나옹", "야옹", "몇글자까지가넝", "쏙쏙마스터"]; // 임시 친구 리스트

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await myFriendApi();
        const friendList = res.data.data.friendList; // ✅ 여기서 추출
        setFriendList(friendList);
      } catch (err) {
        console.error("친구 목록 불러오기 실패:", err);
      }
    };
  
    fetchFriends();
  }, []);
  
  

  const handleSearchFriend = async () => {
    if (!searchInput.trim()) return;
  
    try {
      const res = await searchFriendApi(searchInput);
    //   console.log(res)
      const result = res.data;
  
      if (result.length > 0) {
        setSearchResultList(result); // 배열 저장
      } else {
        setSearchResultList([]);
        alert("검색 결과가 없습니다.");
      }
    } catch (err) {
      console.error("친구 검색 실패:", err);
      alert("검색 중 오류가 발생했습니다.");
    }
  };
  

  return (
    <div className="modal-wrapper">
      <div className="relative w-[70rem]">
        <img src={modalBg} alt="모달 배경" className="w-full h-auto" />

        {/* 내용 */}
        <div className="absolute top-[3rem] w-full h-[60%] flex flex-col items-center justify-center p-10">
          {/* 닫기 버튼 */}
          <button
            className="absolute top-[0.1rem] right-[1.5rem] w-12 h-12"
            onClick={onClose}
          >
            <img src={closeIcon} alt="닫기" />
          </button>

          {/* 타이틀 */}
          <h2 className="modal-title mt-20">함께 읽기 요청</h2>

          {/* 본문 2단 */}
          <div className="flex w-full h-[10rem] gap-8">
            {/* 왼쪽: ID 검색 */}
            <div className="flex flex-col items-start w-1/2 pr-4 border-r-2 border-b-red-900 ml-10">
              <p className="text-white font-whitechalk text-2xl mb-2">ID로 검색</p>
              <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearchFriend(); // ✅ 엔터 감지
                }}
                placeholder="아이디를 검색하세요"
                className="w-[20rem] px-3 py-1 rounded-md text-black font-whitechalk"
                />

                <button
                    onClick={handleSearchFriend}
                    className="w-12 h-12 bg-center bg-no-repeat bg-contain"
                    style={{ backgroundImage: `url(${searchIcon})` }}
                    aria-label="검색"
                />
                </div>

                {/* 결과 리스트 출력 */}
                <div className="grid grid-cols-3 gap-3 overflow-y-auto max-h-[6.5rem] pr-2">
                    {searchResultList.length > 0 ? (
                        searchResultList.map((id) => (
                        <button
                            key={id}
                            onClick={() => setSelectedFriend(id)}
                            className={`friend-button ${selectedFriend === id ? "selected" : ""}`}
                        >
                            {id}
                        </button>
                        ))
                    ) : (
                        <p className="text-white font-whitechalk text-md col-span-3">
                        검색 결과가 없습니다.
                        </p>
                    )}
                    </div>

            </div>

            {/* 오른쪽: 친구 목록 */}
            <div className="flex flex-col w-1/2 pl-4 mr-10">
            {/* 텍스트는 고정 */}
            <p className="text-white font-whitechalk text-2xl mb-2">
                친구 목록에서 선택
            </p>

            {/* 친구 목록만 스크롤 가능하게 */}
            <div className="grid grid-cols-3 gap-3 overflow-y-auto max-h-[6.5rem] pr-2">
            {friendList.length > 0 ? (
              friendList.map((friend) => (
                <button
                  key={friend.friendId}
                  onClick={() => setSelectedFriend(friend.nickname)}
                  className={`friend-button ${selectedFriend === friend.nickname ? "selected" : ""}`}
                >
                {friend.nickname}
                </button>
                ))
            ) : (
                <p className="text-white font-whitechalk text-md col-span-3">친구 목록이 비어 있습니다.</p>
            )}
            </div>
          </div>
          </div>

          {/* 확인 버튼 */}
          <div className="mb-6">
            <button
              disabled={!selectedFriend}
              onClick={() => onSelectFriend(selectedFriend)}
              className="confirm-button"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendSelectModal;
