import React, { useState, useEffect } from "react";
import '../../styles/book_background.css'; // CSS 파일 임포트
import StoryHeader from "../../components/StoryHeader";
import PhotoModal from "../../components/story/PhotoModal";
import SingleStoryRenderer from "../../components/single/SingleStoryRenderer";
import JSZip from "jszip";
import { useLocation } from "react-router-dom";
import { getFromIndexedDB } from "../../utils/indexedDbUtils";

function SinglePage() {
    const [showModal, setShowModal ] = useState(true); // 진입 시 자동 오픈픈
    const [story, setStory] = useState(null); // ✅ 추가
    const [assets, setAssets] = useState(null); // ✅ 추가
    
    const location = useLocation();
    const { progressPk, fairytale, nowPage, role } = location.state || {};
    
    useEffect(() => {
        // 진입하자마자 preload 시작!
        const preload = async () => {
          const ZIP_KEY = "HanselAndGretel_ZIP"  // 캐시키
          
          let zipBlob = await getFromIndexedDB(ZIP_KEY);

          if (!zipBlob) {
            console.error("❌ ZIP 파일이 IndexedDB에 없습니다. MainPage에서 preload가 안 된 것 같아요.");
            return;
          }

          const zip = await JSZip.loadAsync(zipBlob);
    
          const fileMap = {};
          const fileNames = Object.keys(zip.files);
          // console.log("📁 포함된 파일 목록:", fileNames);
    
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
        {/* 싱글 모드 화면 콘텐츠 */}
        <StoryHeader />

        {/* 포토모달 */}
        <PhotoModal isOpen={showModal} onClose={() => setShowModal(false)} />

        <div className="content-container">
           
        {/* 삽화, 미션, 힌트 등 하위 컴포넌트 */}
        {!showModal && story && assets && (
        <SingleStoryRenderer 
        story={story} 
        assets={assets} 
        progressPk={progressPk}
        totalPageCount={fairytale?.count || story.length}
        nowPage={nowPage}
        />
      )}
        </div>
        
      </div>
    );
  }

export default SinglePage;