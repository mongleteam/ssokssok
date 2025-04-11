import React, { useEffect, useState } from "react";
import illustration from "../../assets/images/illustration_default.png";

function StoryIllustration({ storyData, children }) {
  const [imageSrc, setImageSrc] = useState(illustration);

  useEffect(() => {
    if (window.tornpaperLoaded) return;
    const script = document.createElement("script");
    script.src = "/assets/js/tornpaper.min.js";
    script.onload = () => {
      if (typeof Tornpaper !== "undefined") {
        new Tornpaper({
          filterName: "filter_tornpaper",
          seed: 1,
          tornFrequency: 0.05,
          tornScale: 10,
          grungeFrequency: 0.03,
          grungeScale: 3,
        });
        window.tornpaperLoaded = true;
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (storyData) {
      setImageSrc(storyData.image);
    }
  }, [storyData]);
  return (
    <div className="relative w-full h-auto">
      <img
        src={imageSrc}
        alt="Illustration"
        className="w-full h-auto"
        style={{ filter: "url(#filter_tornpaper)" }}
      />
      {/* 미션 오버레이를 일러스트레이션 위에 표시 */}
      {children && (
        <div className="absolute inset-0 z-10 pointer-events-auto">
          {children}
        </div>
      )}
    </div>
  );
}

export default StoryIllustration;
