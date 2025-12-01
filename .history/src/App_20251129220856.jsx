import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function Square({value, onSquareClick}){
  
  
  return(
  <button className='square' onClick={onSquareClick}>{value}</button>
);

}

function Board({xIsNext, squares, onPlay}) {
 
  function Handleclick(i){

    if ( Calculatewinner(squares) || squares[i]) {
    return;
  }
  
    const nextSquares = squares.slice()
    if (xIsNext){
    nextSquares[i] = "X"
    }else{
      nextSquares[i] = "O"
    }
    onPlay(nextSquares);
  }
    const winner = Calculatewinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  return (
    <>

    <div className="status">{status}</div>
  <div className='board-row'>
  <Square value = {squares[0]} onSquareClick={() =>Handleclick(0)}/>
  <Square value = {squares[1]} onSquareClick={() =>Handleclick(1)}/>
  <Square value = {squares[2]} onSquareClick={() =>Handleclick(2)}/>
  
  </div>

  <div className='board-row'>
  <Square value = {squares[3]} onSquareClick={() =>Handleclick(3)}/>
  <Square value = {squares[4]} onSquareClick={() =>Handleclick(4)}/>
  <Square value = {squares[5]} onSquareClick={() =>Handleclick(5)}/>
  
  </div>
  <div className='board-row'>
  <Square value = {squares[6]} onSquareClick={() =>Handleclick(6)}/>
  <Square value = {squares[7]} onSquareClick={() =>Handleclick(7)}/>
  <Square value = {squares[8]} onSquareClick={() =>Handleclick(8)}/>
  
  </div>
  
  </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
    <h1>TIC TAC TOE GAME</h1>
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function Calculatewinner(squares){
  const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],

  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}