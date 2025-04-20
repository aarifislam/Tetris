import { memo } from "react"

interface CellProps {
  type: string | null
  isClearing: boolean
  size?: string
}

function Cell({ type, isClearing, size = "w-6 h-6" }: CellProps) {
  return (
    <div
      className={`
        ${size} border border-gray-800
        ${type || "bg-gray-900"}
        ${isClearing ? "animate-[burst_0.5s_ease-out] scale-0 rotate-90 opacity-0 z-10" : ""}
      `}
      style={{
        transition: "all 0.5s ease-out",
      }}
    />
  )
}

// Use memo to prevent unnecessary re-renders
export default memo(Cell)
