import { memo } from "react"

interface NextPieceProps {
  piece: {
    shape: number[][]
    color: string
  } | null
}

function NextPiece({ piece }: NextPieceProps) {
  if (!piece) return null

  return (
    <div className="bg-gray-800 p-4 rounded">
      <h2 className="text-xl font-bold mb-2">Next Piece</h2>
      <div className="flex flex-col items-center">
        {piece.shape.map((row, y) => (
          <div key={y} className="flex">
            {row.map((cell, x) => (
              <div
                key={x}
                className={`
                  w-4 h-4 m-px
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
