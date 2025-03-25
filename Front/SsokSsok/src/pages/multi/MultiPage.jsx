import React from "react";
import '../../styles/book_background.css'; // CSS 파일 임포트
import StoryIllustration from '../../components/story/StoryIllustration'; // StoryIllustration 컴포넌트 임포트

function MultiPage() {
  return (
    <div className="book-background-container">
      {/* 멀티 모드 화면 콘텐츠 */}
      <div className="content-container">
        <h1 className="font-cafe24">멀티 모드</h1>
        {/* StoryIllustration 컴포넌트 출력 */}
        <StoryIllustration />
      </div>
    </div>
  );
}

export default MultiPage;
