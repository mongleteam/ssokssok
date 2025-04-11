// 마녀 손 랜덤 선택
export function getRandomWitchHand() {
  const hands = ["rock", "paper", "scissors"];
  return hands[Math.floor(Math.random() * hands.length)];
}
