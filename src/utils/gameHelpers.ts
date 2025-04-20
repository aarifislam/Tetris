// Constants
export const BOARD_WIDTH = 10
export const BOARD_HEIGHT = 20
export const INITIAL_SPEED = 800 // ms
export const SPEED_INCREASE_FACTOR = 0.85
export const LEVEL_UP_LINES = 10

// Create an empty board
export const createEmptyBoard = () =>
  Array.from({ length: BOARD_HEIGHT }, () => Array.from({ length: BOARD_WIDTH }, () => null))

// Custom animation for burst effect
export const burstAnimation = `
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
