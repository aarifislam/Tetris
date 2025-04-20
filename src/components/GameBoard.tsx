import { memo } from "react"
import Cell from "./Cell"

interface GameBoardProps {
  board: (string | null)[][]
  clearedRows: number[]
}

function GameBoard({ board, clearedRows }: GameBoardProps) {
  return (
    <div className="bg-gray-900 p-1 border-2 border-gray-700 rounded">
      {board.map((row, y) => (
        <div key={y} className="flex">
          {row.map((cell, x) => (
            <Cell key={x} type={cell} isClearing={clearedRows.includes(y)} />
          ))}
        </div>
      ))}
    </div>
  )
}

// Use memo to prevent unnecessary re-renders
export default memo(GameBoard)
