import WebcamSilentMission from "../missions/WebcamSilentMission";
import WebcamCollectStoneMission from "../missions/WebcamCollectStoneMission";
import WebcamReadTextMission from "../missions/WebcamReadTextMission";
import HandHoldBreadMission from "../missions/HandHoldBreadMission";



export const missionMap = {
    "webcam-silent": WebcamSilentMission, // 조용히하기 미션
    "webcam-collect-stone": WebcamCollectStoneMission, // 조약돌 줍기 미션
    "webcam-readtext": WebcamReadTextMission,   // STT 미션
    "hand-hold-bread": HandHoldBreadMission,  // 빵찾기 미션
};