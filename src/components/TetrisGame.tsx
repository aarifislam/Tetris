"use client"

import { useState, useEffect } from "react"
import GameBoard from "./GameBoard"
import GameStats from "./GameStats"
import NextPiece from "./NextPiece"
import Controls from "./Controls"
import MobileControls from "./MobileControls"
import { Button } from "./ui/button"
import useTetris from "../hooks/useTetris"
import useIsMobile from "../hooks/useIsMobile"

export default function TetrisGame() {
  const [gameStarted, setGameStarted] = useState(false)
  const isMobile = useIsMobile()

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
        <>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full max-w-4xl mx-auto">
            {/* Game board */}
            <div className="flex justify-center md:justify-start md:flex-1">
              <GameBoard board={board} clearedRows={clearedRows} />
            </div>

            {/* Game info */}
            <div className="flex flex-row md:flex-col justify-center md:justify-start gap-4 flex-wrap md:flex-nowrap">
              <GameStats score={score} lines={lines} level={level} />

              <NextPiece piece={nextPiece} />

              <div className="hidden md:block">
                <Controls />
              </div>

              <div className="flex gap-2 justify-center md:justify-start">
                <Button onClick={initGame} className="bg-green-600 hover:bg-green-700">
                  {gameOver ? "Restart" : "New Game"}
                </Button>

                <Button onClick={togglePause} className="bg-blue-600 hover:bg-blue-700" disabled={gameOver}>
                  {paused ? "Resume" : "Pause"}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Controls */}
          {gameStarted && !gameOver && !paused && (
            <MobileControls
              onMoveLeft={() => movePiece(-1)}
              onMoveRight={() => movePiece(1)}
              onRotate={rotatePiece}
              onSoftDrop={dropPiece}
              onHardDrop={hardDropPiece}
            />
          )}
        </>
      )}

      {gameOver && <div className="mt-4 text-xl font-bold text-red-500">Game Over!</div>}
    </div>
  )
}
