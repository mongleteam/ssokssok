import React, { useState, useEffect } from "react";
import '../../styles/book_background.css'; // CSS 파일 임포트
import StoryHeader from "../../components/StoryHeader";
import PhotoModal from "../../components/story/PhotoModal";
import SingleStoryRenderer from "../../components/single/SingleStoryRenderer";
import JSZip from "jszip";

function SinglePage() {
    const [ showModal, setShowModal ] = useState(true); // 진입 시 자동 오픈픈
    const [story, setStory] = useState(null); // ✅ 추가
    const [assets, setAssets] = useState(null); // ✅ 추가
    

    useEffect(() => {
        // 진입하자마자 preload 시작!
        const preload = async () => {
          console.log("📦 ZIP 다운로드 시작");
          const zipUrl = "https://ssafy-mongle.s3.ap-southeast-2.amazonaws.com/HanselAndGretelData_single.zip";
          const res = await fetch(zipUrl);
          const blob = await res.blob();
          console.log("📥 ZIP 다운로드 완료. 해제 중...");
          const zip = await JSZip.loadAsync(blob);

          console.log("🔓 ZIP 해제 완료");
    
          const fileMap = {};
          const fileNames = Object.keys(zip.files);
          console.log("📁 포함된 파일 목록:", fileNames);
    
          for (const fileName of fileNames) {
            const file = zip.file(fileName);
            if (file) {
              const contentBlob = await file.async("blob");
              fileMap[fileName] = URL.createObjectURL(contentBlob);
            }
          }
    
          const storyFile = zip.file("story_single.json");
          const storyText = await storyFile.async("string");
          const storyJson = JSON.parse(storyText);
    
          setAssets(fileMap);
          setStory(storyJson);
        };
    
        preload();
      }, []);
    return (
        <div className="book-background-container">
        {/* 싱글글 모드 화면 콘텐츠 */}
        <StoryHeader />

        {/* 포토모달 */}
        <PhotoModal isOpen={showModal} onClose={() => setShowModal(false)} />

        <div className="content-container">
            <h1 className="font-cafe24">싱글 모드</h1>
            {/* 삽화, 미션, 힌트 등 하위 컴포넌트 */}
            {!showModal && story && assets && (
        <SingleStoryRenderer story={story} assets={assets} />
      )}
        </div>
        
      </div>
    );
  }

export default SinglePage;