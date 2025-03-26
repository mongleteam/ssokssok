import React, { useEffect } from 'react';
import illustration from '../../assets/images/illustration_default.png';

function StoryIllustration() {
  useEffect(() => {
    if (window.tornpaperLoaded) return; // 이미 로드된 경우 리턴
    
    const script = document.createElement('script');
    script.src = '/assets/js/tornpaper.min.js';
    script.onload = () => {
      if (typeof Tornpaper !== 'undefined') {
        new Tornpaper({
          filterName: "filter_tornpaper",
          seed: 1,
          tornFrequency: 0.05,
          tornScale: 10,
          grungeFrequency: 0.03,
          grungeScale: 3
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
    <div className="relative w-full h-auto torn-effect">
      <img
        src={illustration}
        alt="Illustration"
        className="w-full h-auto"
        style={{ filter: "url(#filter_tornpaper)" }}
      />
    </div>
  );
}

export default StoryIllustration;
