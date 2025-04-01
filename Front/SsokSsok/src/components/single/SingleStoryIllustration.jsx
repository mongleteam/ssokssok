import React, { useEffect } from 'react';

function SingleStoryIllustration({ src, videoRef = null }) {
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

  return (
    <div className="relative w-[54rem] h-auto torn-effect mt-6 mb-3 overflow-hidden rounded-xl">
    {videoRef ? (
      <video
        ref={videoRef}
        autoPlay
        muted
        className="w-full h-full object-cover"
        style={{ filter: "url(#filter_tornpaper)" }}
      />
    ) : (
      <img
        src={src}
        alt="Illustration"
        className="w-full h-auto object-cover"
        style={{ filter: "url(#filter_tornpaper)" }}
      />
    )}
  </div>
);
}

export default SingleStoryIllustration;
