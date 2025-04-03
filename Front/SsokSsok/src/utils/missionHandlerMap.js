// import { silentHandler } from "../hooks/missions/silentHandler";
import { eatCookieHandler } from "../hooks/missions/eatCookieHandler";
import { rpsHandler } from "../hooks/missions/rpsHandler";
import { cleanHandler } from "../hooks/missions/cleanHandler";
import { readTextHandler } from "../hooks/missions/readTextHandler";
import { drawStarHandler } from "../hooks/missions/drawStarHandler";
import { holdBreadHandler } from "../hooks/missions/holdBreadHandler";
import { getKeyHandler } from "../hooks/missions/getKeyHandler";
import { getMagicbookHandler } from "../hooks/missions/getMagicbookHandler";
import { drawHandler } from "../hooks/missions/drawHandler";
import { treasureHuntHandler } from "../hooks/missions/treasureHuntHandler";
import { silentHandler } from "../hooks/missions/silentHandler";

export const missionHandlerMap = {
  "webcam-silent-multi": silentHandler,
  "webcam-eatcookie": eatCookieHandler,
  "webcam-rps-multi": rpsHandler,
  "webcam-clean-multi": cleanHandler,
  "webcam-readtext-multi": readTextHandler,
  "webcam-draw-star": drawStarHandler,
  "hand-hold-bread--multi": holdBreadHandler,
  "webcam-getkey-multi": getKeyHandler,
  "webcam-get-magicbook-multi": getMagicbookHandler,
  "webcam-draw-multi": drawHandler,
  "treasure-hunt": treasureHuntHandler,
};
