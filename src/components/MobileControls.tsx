"use client"

import { memo } from "react"
import { Button } from "./ui/button"

interface MobileControlsProps {
  onMoveLeft: () => void
  onMoveRight: () => void
  onRotate: () => void
  onSoftDrop: () => void
  onHardDrop: () => void
}

function MobileControls({ onMoveLeft, onMoveRight, onRotate, onSoftDrop, onHardDrop }: MobileControlsProps) {
  return (
    <div className="md:hidden w-full max-w-md mx-auto mt-4">
      <div className="grid grid-cols-3 gap-2">
        {/* Top row */}
        <div className="col-start-2">
          <Button
            onClick={onRotate}
            className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-2xl"
            aria-label="Rotate"
          >
            ↻
          </Button>
        </div>

        {/* Middle row */}
        <div>
          <Button
            onClick={onMoveLeft}
            className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-2xl"
            aria-label="Move Left"
          >
            ←
          </Button>
        </div>
        <div>
          <Button
            onClick={onSoftDrop}
            className="w-full h-14 bg-yellow-600 hover:bg-yellow-700 text-2xl"
            aria-label="Soft Drop"
          >
            ↓
          </Button>
        </div>
        <div>
          <Button
            onClick={onMoveRight}
            className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-2xl"
            aria-label="Move Right"
          >
            →
          </Button>
        </div>

        {/* Bottom row */}
        <div className="col-span-3 mt-2">
          <Button onClick={onHardDrop} className="w-full h-14 bg-red-600 hover:bg-red-700" aria-label="Hard Drop">
            HARD DROP
          </Button>
        </div>
      </div>
    </div>
  )
}

export default memo(MobileControls)
