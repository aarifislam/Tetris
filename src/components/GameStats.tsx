import { memo } from "react"

interface GameStatsProps {
  score: number
  lines: number
  level: number
}

function GameStats({ score, lines, level }: GameStatsProps) {
  return (
    <div className="bg-gray-800 p-4 rounded">
      <h2 className="text-xl font-bold mb-2">Score: {score}</h2>
      <p>Lines: {lines}</p>
      <p>Level: {level}</p>
    </div>
  )
}

// Use memo to prevent unnecessary re-renders
export default memo(GameStats)
