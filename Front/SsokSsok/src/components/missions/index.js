import WebcamSilentMission from "../missions/WebcamSilentMission";
import WebcamCollectStoneMission from "../missions/WebcamCollectStoneMission";
import WebcamReadTextMission from "../missions/WebcamReadTextMission";
import HandHoldBreadMission from "../missions/HandHoldBreadMission";
import EatCookieMission from "../missions/EatCookieMisson";
import RockScissorsPaperMission from "../missions/RockScissorsPaperMission";
import WebcamCleanMission from "./WebcamCleanMission";

export const missionMap = {
  "webcam-silent": WebcamSilentMission, // 조용히하기 미션
  "webcam-collect-stone": WebcamCollectStoneMission, // 조약돌 줍기 미션
  "webcam-readtext": WebcamReadTextMission, // STT 미션션
  "hand-hold-bread": HandHoldBreadMission, // 빵찾기 미션
  "webcam-eatcookie": EatCookieMission, // 쿠키 미션
  "webcam-get-magicbook": RockScissorsPaperMission, // 가위바위보 미션
  "webcam-clean": WebcamCleanMission, // 청소 미션
};
