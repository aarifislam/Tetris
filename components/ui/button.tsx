import type React from "react"
import type { ButtonHTMLAttributes } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  children: React.ReactNode
}

export function Button({ className = "", children, ...props }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
