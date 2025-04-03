function CanvasMission({ mission }) {
    return (
      <div className="relative w-full h-auto">
        <img src={mission.instructionImagesFiles?.[0]} className="w-full" />
        {/* 드로잉용 canvas 등 삽화 기반 작업 */}
        <canvas className="absolute inset-0" />
      </div>
    );
  }
  
  export default CanvasMission;
