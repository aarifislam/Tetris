"use client"

import { memo } from "react"
import useIsMobile from "../hooks/useIsMobile"

interface NextPieceProps {
  piece: {
    shape: number[][]
    color: string
  } | null
}

function NextPiece({ piece }: NextPieceProps) {
  const isMobile = useIsMobile()

  if (!piece) return null

  // Determine cell size based on screen size
  const cellSize = isMobile ? "w-3 h-3" : "w-4 h-4"

  return (
    <div className="bg-gray-800 p-3 md:p-4 rounded">
      <h2 className="text-lg md:text-xl font-bold mb-1 md:mb-2 text-center md:text-left">Next</h2>
      <div className="flex flex-col items-center">
        {piece.shape.map((row, y) => (
          <div key={y} className="flex">
            {row.map((cell, x) => (
              <div
                key={x}
                className={`
                  ${cellSize} m-px
                  ${cell ? piece.color : "bg-transparent"}
                `}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// Use memo to prevent unnecessary re-renders
export default memo(NextPiece)
