import React from "react";
import '../../styles/book_background.css'; // CSS 파일 임포트

function MultiPage() {
    return (
        <div className="book-background-container">
        {/* 멀티 모드 화면 콘텐츠 */}
        <div className="content-container">
            <h1 className="font-cafe24">멀티 모드</h1>
            {/* 삽화, 미션, 힌트 등 하위 컴포넌트 */}
        </div>
      </div>
    );
  }

export default MultiPage