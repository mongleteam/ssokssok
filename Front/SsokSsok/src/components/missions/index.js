import WebcamSilentMission from "../missions/WebcamSilentMission";
import WebcamCollectStoneMission from "../missions/WebcamCollectStoneMission";
import WebcamReadTextMission from "../missions/WebcamReadTextMission";
import EatCookieMission from "../missions/EatCookieMisson";
import RockScissorsPaperMission from "../missions/RockScissorsPaperMission";

export const missionMap = {
    "webcam-silent": WebcamSilentMission, // 조용히하기 미션
    "webcam-collect-stone": WebcamCollectStoneMission, // 조약돌 줍기 미션
    "webcam-readtext": WebcamReadTextMission,   // STT 미션션
    "webcam-eatcookie": EatCookieMission, // 쿠키 미션
    "webcam-get-magicbook": RockScissorsPaperMission // 가위바위보 미션
};