"use client"

import { memo } from "react"
import Cell from "./Cell"
import useIsMobile from "../hooks/useIsMobile"

interface GameBoardProps {
  board: (string | null)[][]
  clearedRows: number[]
}

function GameBoard({ board, clearedRows }: GameBoardProps) {
  const isMobile = useIsMobile()

  // Determine cell size based on screen size
  const cellSize = isMobile ? "w-5 h-5" : "w-6 h-6"

  return (
    <div className="bg-gray-900 p-1 border-2 border-gray-700 rounded">
      {board.map((row, y) => (
        <div key={y} className="flex">
          {row.map((cell, x) => (
            <Cell key={x} type={cell} isClearing={clearedRows.includes(y)} size={cellSize} />
          ))}
        </div>
      ))}
    </div>
  )
}

// Use memo to prevent unnecessary re-renders
export default memo(GameBoard)
