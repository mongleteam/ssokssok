// import React, { useState, useEffect } from "react";
// import StoryDialogueBlock from "../single/StroyDialogueBlock";
// import MissionBlock from "../single/MissionBlock";

// const ContentArea = ({ page, showMission, MissionComponent, assets, onMissionComplete }) => {
//   const [scriptText, setScriptText] = useState("");
//   const [statusContent, setStatusContent] = useState(null);

//   useEffect(() => {
//     const fetchText = async () => {
//       const file = showMission ? page.mission?.instructions : page.script;
//       if (!file || !assets[file]) return setScriptText("");
//       try {
//         const res = await fetch(assets[file]);
//         const text = await res.text();
//         setScriptText(text);
//       } catch (err) {
//         console.error("텍스트 불러오기 실패:", err);
//         setScriptText("❌ 텍스트를 불러올 수 없습니다.");
//       }
//     };
//     fetchText();
//   }, [page, showMission, assets]);

//   useEffect(() => {
//     console.log("📦 statusContent 상태:", statusContent);
//   }, [statusContent]);

//   if (showMission && MissionComponent) {
//     return (
//       <>
//         <MissionComponent
//           onComplete={onMissionComplete}
//           setStatusContent={(content) => {
//             // console.log("✅ setStatusContent 호출됨 (ContentArea에서)", content);
//             setStatusContent(content);
//           }}
//           missionProps={page.mission}
//           assets={assets}
//         />
//         <MissionBlock
//           onComplete={onMissionComplete}
//           hintImage={page.mission?.hintImage}
//           instructionFile={page.mission?.instructions}
//           assets={assets}
//           missionProps={page.mission}
//           statusContent={statusContent}
//         />
//       </>
//     );
//   }

//   return <StoryDialogueBlock text={scriptText} />;
// };

// export default ContentArea;


import React, { useState, useEffect } from "react";
import StoryDialogueBlock from "../single/StroyDialogueBlock";
import MissionBlock from "../single/MissionBlock";

const ContentArea = ({ page, showMission, MissionComponent, assets, onMissionComplete }) => {
  const [scriptText, setScriptText] = useState("");
  const [statusContent, setStatusContent] = useState(null);

  useEffect(() => {
    const fetchText = async () => {
      const file = showMission ? page.mission?.instructions : page.script;
      if (!file || !assets[file]) return setScriptText("");
      try {
        const res = await fetch(assets[file]);
        const text = await res.text();
        setScriptText(text);
      } catch (err) {
        console.error("텍스트 불러오기 실패:", err);
        setScriptText("❌ 텍스트를 불러올 수 없습니다.");
      }
    };
    fetchText();
  }, [page, showMission, assets]);

  useEffect(() => {
    console.log("📦 statusContent 상태:", statusContent);
  }, [statusContent]);

  if (showMission && MissionComponent) {
    return (
      <>
        <MissionComponent
          onComplete={onMissionComplete}
          setStatusContent={(content) => {
            console.log("✅ setStatusContent 호출됨 (ContentArea에서)", content);
            setStatusContent(content);
          }}
          missionProps={page.mission}
          assets={assets}
        />
        <MissionBlock
          onComplete={onMissionComplete}
          hintImage={page.mission?.hintImage}
          instructionFile={page.mission?.instructions}
          assets={assets}
          missionProps={page.mission}
          statusContent={statusContent}
        />
      </>
    );
  }

  return <StoryDialogueBlock text={scriptText} />;
};

export default ContentArea;