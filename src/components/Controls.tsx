import { memo } from "react"

function Controls() {
  return (
    <div className="bg-gray-800 p-3 md:p-4 rounded">
      <h2 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Controls</h2>
      <p className="text-sm md:text-base">← → : Move</p>
      <p className="text-sm md:text-base">↑ : Rotate</p>
      <p className="text-sm md:text-base">↓ : Soft Drop</p>
      <p className="text-sm md:text-base">Space : Hard Drop</p>
      <p className="text-sm md:text-base">P : Pause</p>
    </div>
  )
}

// Use memo to prevent unnecessary re-renders
export default memo(Controls)
