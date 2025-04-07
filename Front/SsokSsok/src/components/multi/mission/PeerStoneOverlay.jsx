const PeerStoneOverlay = ({ stones = [], stoneImage }) => {
    if (!stones.length) return null;
  
    return (
      <>
        {stones.map((stone) => (
          <img
            key={stone.id}
            src={stoneImage}
            alt="peer-stone"
            className="absolute w-12 h-12 z-30 opacity-70"
            style={{
              left: `${stone.x * 100}%`, // 상대방이 보낸 normalized 위치
              top: `${stone.y * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </>
    );
  };
  
  export default PeerStoneOverlay;
  