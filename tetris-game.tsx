"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useInterval } from "./hooks/use-interval"

// Add custom animation for burst effect
const burstAnimation = `
@keyframes burst {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  20% {
    transform: scale(1.2);
    opacity: 0.9;
  }
  100% {
    transform: scale(0) rotate(360deg);
    opacity: 0;
  }
}
`

// Constants
const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20
const INITIAL_SPEED = 800 // ms
const SPEED_INCREASE_FACTOR = 0.85
const LEVEL_UP_LINES = 10

// Tetromino shapes
const TETROMINOES = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: "bg-cyan-500",
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "bg-blue-500",
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "bg-orange-500",
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "bg-yellow-500",
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: "bg-green-500",
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "bg-purple-500",
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: "bg-red-500",
  },
}

// Create an empty board
const createEmptyBoard = () =>
  Array.from({ length: BOARD_HEIGHT }, () => Array.from({ length: BOARD_WIDTH }, () => null))

// Random tetromino generator
const randomTetromino = () => {
  const keys = Object.keys(TETROMINOES)
  const key = keys[Math.floor(Math.random() * keys.length)]
  return {
    ...TETROMINOES[key],
    key,
  }
}

export default function TetrisGame() {
  const [board, setBoard] = useState(createEmptyBoard())
  const [currentPiece, setCurrentPiece] = useState(null)
  const [nextPiece, setNextPiece] = useState(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [gameOver, setGameOver] = useState(false)
  const [paused, setPaused] = useState(false)
  const [score, setScore] = useState(0)
  const [lines, setLines] = useState(0)
  const [level, setLevel] = useState(1)
  const [speed, setSpeed] = useState(INITIAL_SPEED)
  const [clearedRows, setClearedRows] = useState([])
  const [shadowPosition, setShadowPosition] = useState({ x: 0, y: 0 })
  const [isHardDropping, setIsHardDropping] = useState(false)

  // Initialize game
  const initGame = useCallback(() => {
    setBoard(createEmptyBoard())
    setCurrentPiece(randomTetromino())
    setNextPiece(randomTetromino())
    setPosition({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 })
    setGameOver(false)
    setPaused(false)
    setScore(0)
    setLines(0)
    setLevel(1)
    setSpeed(INITIAL_SPEED)
    setClearedRows([])
    setIsHardDropping(false)
  }, [])

  // Check for collisions
  const checkCollision = useCallback(
    (piece, pos) => {
      if (!piece) return false

      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          // Skip empty cells
          if (!piece.shape[y][x]) continue

          const boardX = pos.x + x
          const boardY = pos.y + y

          // Check boundaries
          if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
            return true
          }

          // Check if cell is already occupied
          if (boardY >= 0 && board[boardY][boardX]) {
            return true
          }
        }
      }

      return false
    },
    [board],
  )

  // Calculate shadow position
  const calculateShadowPosition = useCallback(() => {
    if (!currentPiece) return { x: 0, y: 0 }

    let shadowY = position.y

    while (!checkCollision(currentPiece, { x: position.x, y: shadowY + 1 })) {
      shadowY++
    }

    return { x: position.x, y: shadowY }
  }, [currentPiece, position, checkCollision])

  // Update shadow position when piece moves
  useEffect(() => {
    if (currentPiece && !isHardDropping) {
      setShadowPosition(calculateShadowPosition())
    }
  }, [currentPiece, position, calculateShadowPosition, isHardDropping])

  // Rotate piece
  const rotatePiece = useCallback(() => {
    if (!currentPiece || isHardDropping) return

    // Create a rotated matrix
    const rotatedPiece = {
      ...currentPiece,
      shape: currentPiece.shape.map((_, i) => currentPiece.shape.map((row) => row[i])).map((row) => [...row].reverse()),
    }

    // Check if rotation is valid
    if (!checkCollision(rotatedPiece, position)) {
      setCurrentPiece(rotatedPiece)
      setShadowPosition(calculateShadowPosition())
    }
  }, [currentPiece, position, checkCollision, calculateShadowPosition, isHardDropping])

  // Move piece horizontally
  const movePiece = useCallback(
    (direction) => {
      if (gameOver || paused || isHardDropping) return

      const newX = position.x + direction
      if (!checkCollision(currentPiece, { x: newX, y: position.y })) {
        setPosition((prev) => ({ ...prev, x: newX }))
        setShadowPosition(calculateShadowPosition())
      }
    },
    [gameOver, paused, position, currentPiece, checkCollision, calculateShadowPosition, isHardDropping],
  )

  // Check for completed rows
  const checkCompletedRows = useCallback(
    (board) => {
      const completedRows = []

      for (let y = 0; y < BOARD_HEIGHT; y++) {
        if (board[y].every((cell) => cell !== null)) {
          completedRows.push(y)
        }
      }

      if (completedRows.length > 0) {
        // Set the completed rows for animation
        setClearedRows(completedRows)

        // Update score
        const linePoints = [40, 100, 300, 1200]
        const points = linePoints[Math.min(completedRows.length - 1, 3)] * level
        setScore((prev) => prev + points)
        setLines((prev) => {
          const newLines = prev + completedRows.length
          // Level up if needed
          if (Math.floor(newLines / LEVEL_UP_LINES) > Math.floor(prev / LEVEL_UP_LINES)) {
            const newLevel = Math.floor(newLines / LEVEL_UP_LINES) + 1
            setLevel(newLevel)
            setSpeed((prev) => prev * SPEED_INCREASE_FACTOR)
          }
          return newLines
        })

        // Remove completed rows after animation
        setTimeout(() => {
          const newBoard = [...board]

          // Remove completed rows
          completedRows.forEach((row) => {
            newBoard.splice(row, 1)
            newBoard.unshift(Array(BOARD_WIDTH).fill(null))
          })

          setBoard(newBoard)
          setClearedRows([])
        }, 500)
      }
    },
    [level],
  )

  // Merge current piece to board
  const mergePieceToBoard = useCallback(
    (pieceToMerge = currentPiece, piecePosition = position) => {
      if (!pieceToMerge) return

      const newBoard = [...board]

      for (let y = 0; y < pieceToMerge.shape.length; y++) {
        for (let x = 0; x < pieceToMerge.shape[y].length; x++) {
          if (pieceToMerge.shape[y][x]) {
            const boardY = piecePosition.y + y
            const boardX = piecePosition.x + x

            // Game over if piece is placed outside the visible board
            if (boardY < 0) {
              setGameOver(true)
              return
            }

            newBoard[boardY][boardX] = pieceToMerge.color
          }
        }
      }

      setBoard(newBoard)

      // Check for completed rows
      checkCompletedRows(newBoard)

      // Set next piece
      setCurrentPiece(nextPiece)
      setNextPiece(randomTetromino())
      setPosition({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 })
    },
    [board, currentPiece, nextPiece, position, checkCompletedRows],
  )

  // Drop piece faster
  const dropPiece = useCallback(() => {
    if (gameOver || paused || isHardDropping) return

    const newY = position.y + 1
    if (!checkCollision(currentPiece, { x: position.x, y: newY })) {
      setPosition((prev) => ({ ...prev, y: newY }))
    } else {
      // Lock the piece in place
      mergePieceToBoard()
    }
  }, [gameOver, paused, position, currentPiece, checkCollision, mergePieceToBoard, isHardDropping])

  // Hard drop piece
  const hardDropPiece = useCallback(() => {
    if (gameOver || paused || !currentPiece || isHardDropping) return

    // Set hard dropping flag to prevent other actions during the drop
    setIsHardDropping(true)

    // Calculate the shadow position (where the piece will land)
    const shadow = calculateShadowPosition()

    // Merge the piece at the shadow position
    mergePieceToBoard(currentPiece, shadow)

    // Reset hard dropping flag after a short delay
    setTimeout(() => {
      setIsHardDropping(false)
    }, 100)
  }, [gameOver, paused, currentPiece, calculateShadowPosition, mergePieceToBoard, isHardDropping])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return

      switch (e.key) {
        case "ArrowLeft":
          movePiece(-1)
          break
        case "ArrowRight":
          movePiece(1)
          break
        case "ArrowDown":
          dropPiece()
          break
        case "ArrowUp":
          rotatePiece()
          break
        case " ":
          hardDropPiece()
          break
        case "p":
          setPaused((prev) => !prev)
          break
        default:
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [gameOver, movePiece, dropPiece, rotatePiece, hardDropPiece, paused])

  // Game loop
  useInterval(() => {
    if (!gameOver && !paused && !isHardDropping) {
      dropPiece()
    }
  }, speed)

  // Start game on mount
  useEffect(() => {
    initGame()
  }, [initGame])

  // Render game board
  const renderBoard = () => {
    const boardWithPiece = [...board.map((row) => [...row])]

    // Add shadow (only if not hard dropping)
    if (currentPiece && shadowPosition && !isHardDropping) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = shadowPosition.y + y
            const boardX = shadowPosition.x + x

            if (
              boardY >= 0 &&
              boardY < BOARD_HEIGHT &&
              boardX >= 0 &&
              boardX < BOARD_WIDTH &&
              !boardWithPiece[boardY][boardX]
            ) {
              boardWithPiece[boardY][boardX] = `${currentPiece.color.replace("bg-", "bg-opacity-30 bg-")}`
            }
          }
        }
      }
    }

    // Add current piece (only if not hard dropping)
    if (currentPiece && !isHardDropping) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = position.y + y
            const boardX = position.x + x

            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              boardWithPiece[boardY][boardX] = currentPiece.color
            }
          }
        }
      }
    }

    return boardWithPiece.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => (
          <div
            key={x}
            className={`
              w-6 h-6 border border-gray-800
              ${cell || "bg-gray-900"}
              ${clearedRows.includes(y) ? "animate-[burst_0.5s_ease-out] scale-0 rotate-90 opacity-0 z-10" : ""}
            `}
            style={{
              transition: "all 0.5s ease-out",
            }}
          />
        ))}
      </div>
    ))
  }

  // Render next piece preview
  const renderNextPiece = () => {
    if (!nextPiece) return null

    return (
      <div className="flex flex-col items-center">
        {nextPiece.shape.map((row, y) => (
          <div key={y} className="flex">
            {row.map((cell, x) => (
              <div
                key={x}
                className={`
                  w-4 h-4 m-px
                  ${cell ? nextPiece.color : "bg-transparent"}
                `}
              />
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white p-4">
      <style>{burstAnimation}</style>
      <h1 className="text-3xl font-bold mb-4">Tetris</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Game board */}
        <div className="bg-gray-900 p-1 border-2 border-gray-700 rounded">{renderBoard()}</div>

        {/* Game info */}
        <div className="flex flex-col gap-4">
          <div className="bg-gray-800 p-4 rounded">
            <h2 className="text-xl font-bold mb-2">Score: {score}</h2>
            <p>Lines: {lines}</p>
            <p>Level: {level}</p>
          </div>

          <div className="bg-gray-800 p-4 rounded">
            <h2 className="text-xl font-bold mb-2">Next Piece</h2>
            {renderNextPiece()}
          </div>

          <div className="bg-gray-800 p-4 rounded">
            <h2 className="text-xl font-bold mb-2">Controls</h2>
            <p>← → : Move</p>
            <p>↑ : Rotate</p>
            <p>↓ : Soft Drop</p>
            <p>Space : Hard Drop</p>
            <p>P : Pause</p>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => initGame()} className="bg-green-600 hover:bg-green-700">
              {gameOver ? "Restart" : "New Game"}
            </Button>

            <Button
              onClick={() => setPaused((prev) => !prev)}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={gameOver}
            >
              {paused ? "Resume" : "Pause"}
            </Button>
          </div>
        </div>
      </div>

      {gameOver && <div className="mt-4 text-xl font-bold text-red-500">Game Over!</div>}
    </div>
  )
}
