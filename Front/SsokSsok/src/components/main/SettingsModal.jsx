import React from "react";
import SettingsBoard from "../../assets/images/setting_board_icon.png"
import useBgmStore from "../../stores/bgmStore";
import BgmIcon from "../../assets/images/sound_icon.png"
import "../../styles/slider.css"; 

const SettingsModal = () => {
  const { volume, setVolume } = useBgmStore()
  

  return (
    <div className="text-black text-xl text-center flex flex-col items-center">
      <img src={SettingsBoard} alt="SettingsBoard" className="w-[14rem] -mt-60" />
        {/* 🔊 배경음악 슬라이더 */}
        <div className="flex items-center w-[27rem] gap-4 mt-7">
        <img src={BgmIcon} alt="bgm" className="w-20" />
        <div className="flex-1 relative">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => {
            const vol = parseFloat(e.target.value)
            // console.log("🎯 슬라이더 움직임:", vol) // 확인용 로그
            setVolume(vol)
          }}
          className="w-full custom-slider"
        />
        </div>
        <span className="text-2xl w-12 text-right font-ganpan pl-2">{Math.round(volume * 100)}%</span>
      </div>

    </div>
  )
}

export default SettingsModal
