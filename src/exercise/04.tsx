// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import {VFC} from 'react'

import {useLocalStorageState} from '../utils'
type SquareIdx = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
type X = 'X'
type O = 'O'
type Square = X | O | null
type Squares = [
  Square,
  Square,
  Square,
  Square,
  Square,
  Square,
  Square,
  Square,
  Square,
]

type Step = Squares
type StepNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
type History = Step[]

interface BoardProps {
  onClick: (squareIdx: SquareIdx) => void
  squares: Squares
}

const Board: VFC<BoardProps> = ({onClick, squares}) => {
  function renderSquare(i: SquareIdx): JSX.Element {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

const initialSquares = (): Squares => Array(9).fill(null) as Squares
const initialHistory = (): History => [initialSquares()]

const Game: VFC = () => {
  const [currentStep, setCurrentStep] = useLocalStorageState(
    'tic-tac-toe:step',
    0 as StepNumber,
  )

  const [history, setHistory] = useLocalStorageState(
    'tic-tac-toe:history',
    initialHistory,
  )

  const currentSquares: Squares = history[currentStep]
  const nextValue = calculateNextValue(currentSquares)
  const winner = calculateWinner(currentSquares)
  const status = calculateStatus(winner, currentSquares, nextValue)

  function selectSquare(square: SquareIdx): void {
    if (winner !== null || currentSquares[square] !== null) {
      return
    }

    const draftHistory = history.slice(0, currentStep + 1) as History
    const squaresDraft = [...currentSquares] as Squares

    squaresDraft[square] = nextValue
    setHistory([...draftHistory, squaresDraft])
    setCurrentStep(draftHistory.length as StepNumber)
  }

  function restart(): void {
    setHistory(initialHistory())
    setCurrentStep(0)
  }

  const moves = history.map((stepSquares, step) => {
    const isCurrentStep = step === currentStep

    const description: string = `${
      step === 0 ? 'Go to game start' : `Go to move #${step}`
    } ${isCurrentStep ? '(current)' : ''}`.trimEnd()

    return (
      <li key={step}>
        <button
          type="button"
          disabled={isCurrentStep}
          onClick={() => setCurrentStep(step as StepNumber)}
        >
          {description}
        </button>
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function calculateStatus(
  winner: X | O | null,
  squares: Squares,
  nextValue: X | O,
) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

function calculateNextValue(squares: Squares): X | O {
  const xSquaresCount = squares.filter(r => r === 'X').length
  const oSquaresCount = squares.filter(r => r === 'O').length
  return oSquaresCount === xSquaresCount ? 'X' : 'O'
}

function calculateWinner(squares: Squares): X | O | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ] as const
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

const App: VFC = () => <Game />

export default App
