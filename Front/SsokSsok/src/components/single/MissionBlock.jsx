import React, { useState, useEffect } from "react";
import boardImage from "../../assets/images/board2.png";
import hintIcon from "../../assets/images/hint_icon.png";
import HintModal from "../../components/story/HintModal";
import titleImage from "../../assets/images/mission_title.png";

const MissionBlock = ({ MissionComponent, onComplete, hintImage, instructionFile, assets }) => {
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);
  const [instructionText, setInstructionText] = useState("");
  

  useEffect(() => {
    const fetchInstructions = async () => {
      if (!instructionFile || !assets[instructionFile]) {
        setInstructionText("📛 지시사항 파일 없음");
        return;
      }

      try {
        const res = await fetch(assets[instructionFile]);
        const text = await res.text();
        setInstructionText(text);
      } catch (e) {
        console.error("지시사항 불러오기 실패:", e);
        setInstructionText("❌ 지시사항을 불러올 수 없습니다.");
      }
    };

    fetchInstructions();
  }, [instructionFile, assets]);

  if (!MissionComponent) return null;

  return (
    <div className="w-full flex flex-col items-center relative">
      <div className="w-full max-w-6xl px-4 relative">
        {/* ✅ 타이틀 이미지: 나무판 위에 겹쳐서 */}
        {titleImage && (
          <img
            src={titleImage}
            alt="미션 제목"
            className="absolute top- left-1/2 transform -translate-x-1/2 w-60 h-auto z-10"
          />
        )}

        <div
          className="relative w-full px-8 py-6 bg-no-repeat bg-center bg-contain min-h-[120px] mt-6"
          style={{
            backgroundImage: `url(${boardImage})`,
            backgroundSize: "100% 100%",
          }}
        >
          {/* ✅ instructions 텍스트 */}
          <div className="text-center font-cafe24 text-2xl mt-8 whitespace-pre-line leading-relaxed">
            {instructionText}
          </div>

        {/* ✅ 하단 공간 확보 (여기 카운트다운 UI 등 들어갈 예정) */}
        <div className="h-[100px]" />

          {/* 미션 컴포넌트가 있을 경우 */}
          <div className="flex flex-col items-center justify-center w-full">
            <MissionComponent onComplete={onComplete} />
          </div>

          {hintImage && (
            <button
              className="absolute top-3 right-4 w-10 h-10 hover:scale-110 transition-transform"
              onClick={() => setIsHintModalOpen(true)}
            >
              <img src={hintIcon} alt="힌트" className="w-full h-full" />
            </button>
          )}
        </div>
      </div>

      {isHintModalOpen && (
        <HintModal
          hintImage={hintImage}
          onClose={() => setIsHintModalOpen(false)}
        />
      )}
    </div>
  );
};

export default MissionBlock;


// import React, { useState, useEffect } from "react";
// import boardImage from "../../assets/images/board2.png";
// import hintIcon from "../../assets/images/hint_icon.png";
// import HintModal from "../../components/story/HintModal";
// import titleImage from "../../assets/images/mission_title.png";

// const MissionBlock = ({ MissionComponent, onComplete, hintImage, instructionFile, assets }) => {
//   const [isHintModalOpen, setIsHintModalOpen] = useState(false);
//   const [instructionText, setInstructionText] = useState("");
//   const [statusContent, setStatusContent] = useState(null); // ✅ 상태 표시용 UI

//   useEffect(() => {
//     const fetchInstructions = async () => {
//       if (!instructionFile || !assets[instructionFile]) {
//         setInstructionText("📛 지시사항 파일 없음");
//         return;
//       }

//       try {
//         const res = await fetch(assets[instructionFile]);
//         const text = await res.text();
//         setInstructionText(text);
//       } catch (e) {
//         console.error("지시사항 불러오기 실패:", e);
//         setInstructionText("❌ 지시사항을 불러올 수 없습니다.");
//       }
//     };

//     fetchInstructions();
//   }, [instructionFile, assets]);

//   if (!MissionComponent) return null;

//   return (
//     <div className="w-full flex flex-col items-center relative">
//       {/* 👁️ 1. 미션 콘텐츠 (웹캠 등) */}
//       <MissionComponent onComplete={onComplete} setStatusContent={setStatusContent} />

//       {/* 🪵 2. 나무판자 (지시사항 + 상태 UI) */}
//       <div className="w-full max-w-6xl px-4 relative">
//         {/* 제목 이미지 */}
//         <img
//           src={titleImage}
//           alt="미션 제목"
//           className="absolute top-3 left-1/2 transform -translate-x-1/2 w-60 h-auto z-10"
//         />

//         <div
//           className="relative w-full px-8 py-6 bg-no-repeat bg-center bg-contain min-h-[160px] mt-12"
//           style={{
//             backgroundImage: `url(${boardImage})`,
//             backgroundSize: "100% 100%",
//           }}
//         >
//           {/* 지시사항 텍스트 */}
//           <div className="text-center font-cafe24 text-2xl mt-8 whitespace-pre-line leading-relaxed">
//             {instructionText}
//           </div>

//           {/* 👇 상태 UI (데시벨, 카운트다운 등) */}
//           <div className="mt-6">{statusContent}</div>

//           {/* 힌트 버튼 */}
//           {hintImage && (
//             <button
//               className="absolute top-3 right-4 w-10 h-10 hover:scale-110 transition-transform"
//               onClick={() => setIsHintModalOpen(true)}
//             >
//               <img src={hintIcon} alt="힌트" className="w-full h-full" />
//             </button>
//           )}
//         </div>
//       </div>

//       {/* 힌트 모달 */}
//       {isHintModalOpen && (
//         <HintModal
//           hintImage={hintImage}
//           onClose={() => setIsHintModalOpen(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default MissionBlock;
