import React, { useState, useEffect } from "react";
import '../../styles/book_background.css'; // CSS 파일 임포트
import StoryHeader from "../../components/StoryHeader";
import PhotoModal from "../../components/story/PhotoModal";

function SinglePage() {
    const [ showModal, setShowModal ] = useState(true); // 진입 시 자동 오픈픈

    useEffect(() => {
        const timer = setTimeout(() => setShowModal(false), 10000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="book-background-container">
        {/* 멀티 모드 화면 콘텐츠 */}
        <StoryHeader />

        {/* 포토모달 */}
        <PhotoModal isOpen={showModal} onClose={() => setShowModal(false)} />
        

        <div className="content-container">
            <h1 className="font-cafe24">싱글 모드</h1>
            {/* 삽화, 미션, 힌트 등 하위 컴포넌트 */}
        </div>
      </div>
    );
  }

export default SinglePage;