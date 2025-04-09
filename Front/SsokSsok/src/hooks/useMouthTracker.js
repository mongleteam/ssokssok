// ✅ hooks/useMouthTracker.js
import { useEffect, useRef, useState } from "react";
import { isMouthOpen } from "../utils/mouthUtils";

export const useMouthTracker = (faceLandmarks) => {
  const [mouthOpen, setMouthOpen] = useState(false);
  const prevMouthOpen = useRef(false);

  useEffect(() => {
    if (!faceLandmarks) return;
    const open = isMouthOpen(faceLandmarks);
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