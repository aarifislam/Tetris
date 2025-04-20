# React Tetris Game

A modern implementation of the classic Tetris game built with React and TypeScript.

## Features

- Classic Tetris gameplay
- Increasing difficulty as you level up
- Row clearing animations
- Shadow projection showing where pieces will land
- Score tracking with classic Tetris scoring system
- Next piece preview

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/react-tetris.git
cd react-tetris
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

4. Open your browser and navigate to `http://localhost:5173`

## How to Play

- Use the arrow keys to move and rotate pieces
- Left/Right: Move piece horizontally
- Up: Rotate piece
- Down: Soft drop (move piece down faster)
- Space: Hard drop (instantly place the piece)
- P: Pause/Resume game

## Deployment

To build the project for production:

\`\`\`bash
npm run build
# or
yarn build
\`\`\`

The build files will be located in the `dist` directory, ready to be deployed to GitHub Pages or any other static hosting service.

## Project Structure

\`\`\`
src/
├── components/       # React components
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── styles/           # CSS and style files
├── App.tsx           # Main application component
└── index.tsx         # Application entry point
\`\`\`

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Vite

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the classic Tetris game
- Built with modern React practices and TypeScript
\`\`\`

Let's create a simple .gitignore file:

```gitignore file=".gitignore"
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
