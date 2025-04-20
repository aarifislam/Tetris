import { memo } from "react"

interface GameStatsProps {
  score: number
  lines: number
  level: number
}

function GameStats({ score, lines, level }: GameStatsProps) {
  return (
    <div className="bg-gray-800 p-3 md:p-4 rounded">
      <h2 className="text-lg md:text-xl font-bold mb-1 md:mb-2 text-center md:text-left">Score: {score}</h2>
      <p className="text-sm md:text-base text-center md:text-left">Lines: {lines}</p>
      <p className="text-sm md:text-base text-center md:text-left">Level: {level}</p>
    </div>
  )
}

// Use memo to prevent unnecessary re-renders
export default memo(GameStats)
