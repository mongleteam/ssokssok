function OverlayMission({ mission }) {
    return (
      <div className="absolute inset-0 z-50 pointer-events-none">
        {/* 예: 쿠키 이미지, 조약돌 등 */}
        {mission.instructionImagesFiles?.map((img, i) => (
          <img key={i} src={img} className="absolute left-x top-y" />
        ))}
      </div>
    );
  }
  
  export default OverlayMission;
