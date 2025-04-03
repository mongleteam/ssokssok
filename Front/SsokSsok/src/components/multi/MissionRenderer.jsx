// src/components/multi/MissionRenderer.jsx
import OverlayMission from "./OverlayMission";
import CanvasMission from "./CanvasMission";
import SimpleMission from "./SimpleMission";

function MissionRenderer({ storyData, role, from }) {
    const mission = storyData?.mission;
    if (!mission) return null;
  
    const isMine = !mission.role || mission.role === role;
    if (!isMine) return null;
  
    const type = mission.type;
  
    if (["webcam-collect-stone-multi", "webcam-eatcookie", "webcam-clean-multi", "webcam-getkey-multi", "webcam-rockpaperscissors"].includes(type)) {
      return <OverlayMission mission={mission} />;
    }
  
    if (["webcam-draw-multi", "treasure-hunt"].includes(type)) {
      return <CanvasMission mission={mission} />;
    }
  
    return <SimpleMission mission={mission} />;
  }
  
  export default MissionRenderer;
