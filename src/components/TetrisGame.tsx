"use client"

import { useState, useEffect } from "react"
import GameBoard from "./GameBoard"
import GameStats from "./GameStats"
import NextPiece from "./NextPiece"
import Controls from "./Controls"
import { Button } from "../components/ui/button"
import useTetris from "../hooks/useTetris"

export default function TetrisGame() {
  const [gameStarted, setGameStarted] = useState(false)

  const {
    board,
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
  } = useTetris()

  // Start game when component mounts if gameStarted is true
  useEffect(() => {
    if (gameStarted) {
      initGame()
    }
  }, [gameStarted, initGame])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver || !gameStarted) return

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
          togglePause()
          break
        default:
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [gameOver, gameStarted, movePiece, dropPiece, rotatePiece, hardDropPiece, togglePause])

  const startGame = () => {
    setGameStarted(true)
    initGame()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Tetris</h1>

      {!gameStarted && !gameOver ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-xl mb-4">Press Start to play</p>
          <Button onClick={startGame} className="bg-green-600 hover:bg-green-700">
            Start Game
          </Button>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          {/* Game board */}
          <GameBoard board={board} clearedRows={clearedRows} />

          {/* Game info */}
          <div className="flex flex-col gap-4">
            <GameStats score={score} lines={lines} level={level} />

            <NextPiece piece={nextPiece} />

            <Controls />

            <div className="flex gap-2">
              <Button onClick={initGame} className="bg-green-600 hover:bg-green-700">
                {gameOver ? "Restart" : "New Game"}
              </Button>

              <Button onClick={togglePause} className="bg-blue-600 hover:bg-blue-700" disabled={gameOver}>
                {paused ? "Resume" : "Pause"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {gameOver && <div className="mt-4 text-xl font-bold text-red-500">Game Over!</div>}
    </div>
  )
}
