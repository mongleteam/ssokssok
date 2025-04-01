// ✅ hooks/useMouthTracker.js
import { useEffect, useRef, useState } from "react";
import { isMouthOpen } from "../utils/mouthUtils";

export const useMouthTracker = (faceLandmarks) => {
  const [mouthOpen, setMouthOpen] = useState(false);
  const prevMouthOpen = useRef(false);

  useEffect(() => {
    // console.log("[MOUTH] faceLandmarks:", faceLandmarks);
    if (!faceLandmarks) return;
    const open = isMouthOpen(faceLandmarks);
    console.log("[MOUTH] isMouthOpen:", open);

    if (open && !prevMouthOpen.current) {
      prevMouthOpen.current = true;
      setMouthOpen(true);
    } else if (!open && prevMouthOpen.current) {
      prevMouthOpen.current = false;
      setMouthOpen(false);
    }
  }, [faceLandmarks]);

  return { mouthOpen };
};