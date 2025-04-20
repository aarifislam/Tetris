"use client"

import { useState, useCallback, useEffect } from "react"
import { useInterval } from "./useInterval"
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  INITIAL_SPEED,
  SPEED_INCREASE_FACTOR,
  LEVEL_UP_LINES,
  createEmptyBoard,
} from "../utils/gameHelpers"
import { randomTetromino } from "../utils/tetrominoes"

export default function useTetris() {
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
    if (!currentPiece || isHardDropping || paused || gameOver) return

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
  }, [currentPiece, position, checkCollision, calculateShadowPosition, isHardDropping, paused, gameOver])

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

  // Toggle pause
  const togglePause = useCallback(() => {
    if (!gameOver) {
      setPaused((prev) => !prev)
    }
  }, [gameOver])

  // Game loop
  useInterval(() => {
    if (!gameOver && !paused && !isHardDropping) {
      dropPiece()
    }
  }, speed)

  // Create a board with current piece and shadow for rendering
  const boardWithPieceAndShadow = useCallback(() => {
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

    return boardWithPiece
  }, [board, currentPiece, shadowPosition, position, isHardDropping])

  return {
    board: boardWithPieceAndShadow(),
    score,
    lines,
    level,
    nextPiece,
    gameOver,
    paused,
    clearedRows,
    initGame,
    movePiece,
    dropPiece,
    hardDropPiece,
    rotatePiece,
    togglePause,
  }
}
