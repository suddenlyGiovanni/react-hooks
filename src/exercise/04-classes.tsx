// useState: tic tac toe
// 💯 (alternate) migrate from classes
// http://localhost:3000/isolated/exercise/04-classes.js

import {Component} from 'react'
import type {VFC} from 'react'

// If you'd rather practice refactoring a class component to a function
// component with hooks, then go ahead and do this exercise.

// 🦉 You've learned all the hooks you need to know to refactor this Board
// component to hooks. So, let's make it happen!

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

interface BoardState {
  squares: Squares
}
class Board extends Component<unknown, BoardState> {
  state: BoardState = {
    squares:
      JSON.parse(window.localStorage.getItem('squares')!) ||
      Array(9).fill(null),
  }

  selectSquare(square: SquareIdx): void {
    const {squares} = this.state
    const nextValue = calculateNextValue(squares)
    if (calculateWinner(squares) || squares[square]) {
      return
    }
    const squaresCopy = [...squares] as Squares
    squaresCopy[square] = nextValue
    this.setState({squares: squaresCopy})
  }
  renderSquare = (i: SquareIdx): JSX.Element => (
    <button className="square" onClick={() => this.selectSquare(i)}>
      {this.state.squares[i]}
    </button>
  )

  restart = (): void => {
    this.setState({squares: Array(9).fill(null) as Squares})
    this.updateLocalStorage()
  }

  componentDidMount(): void {
    this.updateLocalStorage()
  }

  componentDidUpdate(_: unknown, prevState: BoardState): void {
    if (prevState.squares !== this.state.squares) {
      this.updateLocalStorage()
    }
  }

  updateLocalStorage(): void {
    window.localStorage.setItem('squares', JSON.stringify(this.state.squares))
  }

  render() {
    const {squares} = this.state
    const nextValue = calculateNextValue(squares)
    const winner = calculateWinner(squares)
    let status = calculateStatus(winner, squares, nextValue)

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
        <button className="restart" onClick={this.restart}>
          restart
        </button>
      </div>
    )
  }
}

const Game: VFC = () => (
  <div className="game">
    <div className="game-board">
      <Board />
    </div>
  </div>
)

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
  ]
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
