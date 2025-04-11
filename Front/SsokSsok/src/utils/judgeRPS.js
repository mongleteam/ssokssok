// 승패 판단
export function judgeRPS(player, witch) {
  if (player === witch) return "draw";
  if (
    (player === "rock" && witch === "scissors") ||
    (player === "scissors" && witch === "paper") ||
    (player === "paper" && witch === "rock")
  ) {
    return "win";
  }
  return "lose";
}
