import WebcamSilentMission from "../missions/WebcamSilentMission";
import WebcamCollectStoneMission from "../missions/WebcamCollectStoneMission";
import WebcamReadTextMission from "../missions/WebcamReadTextMission";


export const missionMap = {
    "webcam-silent": WebcamSilentMission, // 조용히하기 미션
    "webcam-collect-stone": WebcamCollectStoneMission, // 조약돌 줍기 미션
    "webcam-readtext": WebcamReadTextMission   // STT 미션션
};