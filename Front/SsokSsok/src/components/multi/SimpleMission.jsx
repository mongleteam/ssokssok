function SimpleMission({ mission }) {
    return (
      <div className="p-4 text-xl">
        <p>{mission.instructionsFile ? "지시사항 표시 영역" : "미션 없음"}</p>
        {/* 음성 감지 등 미션 수행 */}
      </div>
    );
  }
  
  export default SimpleMission;
