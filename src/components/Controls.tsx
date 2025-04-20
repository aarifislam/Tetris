import { memo } from "react"

function Controls() {
  return (
    <div className="bg-gray-800 p-4 rounded">
      <h2 className="text-xl font-bold mb-2">Controls</h2>
      <p>← → : Move</p>
      <p>↑ : Rotate</p>
      <p>↓ : Soft Drop</p>
      <p>Space : Hard Drop</p>
      <p>P : Pause</p>
    </div>
  )
}

// Use memo to prevent unnecessary re-renders
export default memo(Controls)
