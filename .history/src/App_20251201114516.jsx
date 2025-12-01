import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function Square({value, onSquareClick, highlight, avatars}){

  
  
  return(
   <button
      className={`square ${highlight ? "highlight" : ""}`}
      onClick={onSquareClick}
    >
      {value && (
        <img 
          src={avatars[value]} 
          alt={value}
          className="avatar-img"
        />
      )}
    </button>
  );

}

function Board({xIsNext, squares, onPlay, avatars}) {
   
  
 
  function Handleclick(i){

    if ( Calculatewinner(squares) || squares[i]) {
    return;
    
  }
    ClickSound.play();
    const nextSquares = squares.slice()
    if (xIsNext){
    nextSquares[i] = "X"
    }else{
      nextSquares[i] = "O"
    }
    onPlay(nextSquares);
  }
    const winner = Calculatewinner(squares);
    const winningLine = Calculatewinner(squares, true);
    const ClickSound = new Audio("/sounds/click.mp3.wav");
    const WinSound = new Audio("/sounds/win.mp3.wav");
    

    
  let status;
  if (winner) {
    status = "Winner: " + winner;
    WinSound.play();
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  
  return (
    <>

    <div className={`status ${winner ? "winner" : ""}`}>{status}</div>
  <div className='board-row'>
  <Square value = {squares[0]} onSquareClick={() =>Handleclick(0)} highlight={winningLine?.includes(0)} avatars={avatars}/>
  <Square value = {squares[1]} onSquareClick={() =>Handleclick(1)} highlight={winningLine?.includes(1)} avatars={avatars}/>
  <Square value = {squares[2]} onSquareClick={() =>Handleclick(2)} highlight={winningLine?.includes(2)} avatars={avatars}/>
  
  </div>

  <div className='board-row'>
  <Square value = {squares[3]} onSquareClick={() =>Handleclick(3)} highlight={winningLine?.includes(3)} avatars={avatars}/>
  <Square value = {squares[4]} onSquareClick={() =>Handleclick(4)} highlight={winningLine?.includes(4)} avatars={avatars}/>
  <Square value = {squares[5]} onSquareClick={() =>Handleclick(5)} highlight={winningLine?.includes(5)} avatars={avatars}/>
  
  </div>
  <div className='board-row'>
  <Square value = {squares[6]} onSquareClick={() =>Handleclick(6)} highlight={winningLine?.includes(6)} avatars={avatars}/>
  <Square value = {squares[7]} onSquareClick={() =>Handleclick(7)} highlight={winningLine?.includes(7)} avatars={avatars}/>
  <Square value = {squares[8]} onSquareClick={() =>Handleclick(8)} highlight={winningLine?.includes(8)} avatars={avatars}/>
  
  </div>
  
  </>
  );
}

export default function Game(){
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  // 🟦 Scoreboard State (X wins, O wins, Draws)
  const [score, setScore] = useState({
    X: 0,
    O: 0,
    Draws: 0
  });
  const [winnerPopup, setWinnerPopup] = useState(null);
  const [avatars, setAvatars] = useState({
  X: "/avatars/braidedwoman.jpg",
  O: "/avatars/manwithglasses.jpg"
});

// 🟦 TIMER STATE
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const timerRef = useRef(null);
// 🟦 TIMER EFFECT
  useEffect(() => {
    if (!isTimerActive || Calculatewinner(currentSquares) || !currentSquares.includes(null)) {
      return;
    }
     // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Set new timer
    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          
          // Auto-make a move when time runs out
          const emptySquares = currentSquares
            .map((square, index) => square === null ? index : null)
            .filter(val => val !== null);
          
          if (emptySquares.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptySquares.length);
            const randomMove = emptySquares[randomIndex];
            
            const nextSquares = currentSquares.slice();
            nextSquares[randomMove] = xIsNext ? "X" : "O";
            
            // Use a small delay to avoid state issues
            setTimeout(() => {
              handlePlay(nextSquares);
            }, 100);
          }
          
          return 30; // Reset timer
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentSquares, isTimerActive, xIsNext]);

  // 🟦 Reset timer when move changes
  useEffect(() => {
    setTimeLeft(30);
  }, [currentMove]);


  function handlePlay(nextSquares) {
    // If game already ended, stop moves
    if (Calculatewinner(currentSquares)) {
setIsTimerActive(false);
      return;
    }

    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      nextSquares,
    ];

    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    // Check winner *after* move
    const winner = Calculatewinner(nextSquares);

    if (winner) {
      setWinnerPopup(winner);
      setIsTimerActive(false);
      // Update score for winner (X or O)
      setScore(prev => ({
        ...prev,
        [winner]: prev[winner] + 1
      }));
    } else if (!nextSquares.includes(null)) {
      // Draw (no empty squares)
      setScore(prev => ({
        ...prev,
        Draws: prev.Draws + 1
      }));
      setIsTimerActive(false);
    }
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setTimeLeft(30);
    setIsTimerActive(true);
  }

  // Time travel move list
  const moves = history.map((squares, move) => {
    let description = move > 0 ? "Go to move #" + move : "Go to game start";
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });
   // 🟦 RESTART FUNCTION - Reset timer too
  const handleRestart = () => {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setWinnerPopup(null);
    setTimeLeft(30);
    setIsTimerActive(true);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  return (
    <div className="game">
      
      <h1>TIC TAC TOE GAME</h1>
      {/* 🟦 TIMER DISPLAY */}
      <div className="timer-container">
        <div className={`timer ${timeLeft <= 10 ? 'warning' : ''}`}>
          ⏱️ Time Left: <span>{timeLeft}s</span>
        </div>
        <button 
          className="timer-toggle"
          onClick={() => setIsTimerActive(!isTimerActive)}
        >
          {isTimerActive ? "⏸️ Pause Timer" : "▶️ Resume Timer"}
        </button>
      </div>

    {/* 🟦 ADD AVATAR SELECTION */}
      <div className="avatar-selection">
        <AvatarSelector 
          player="X" 
          currentAvatar={avatars.X}
          onAvatarChange={(avatar) => setAvatars(prev => ({...prev, X: avatar}))}
        />
        <AvatarSelector 
          player="O" 
          currentAvatar={avatars.O}
          onAvatarChange={(avatar) => setAvatars(prev => ({...prev, O: avatar}))}
        />
      </div>

      {/* 🟦 Scoreboard */}
      <div className="scoreboard">
        <h2>Scoreboard</h2>
        <p>X Wins: {score.X}</p>
        <p>O Wins: {score.O}</p>
        <p>Draws: {score.Draws}</p>
      </div>

      
      <div className={`game-board ${Calculatewinner(currentSquares) ? "winner" : ""}`}>
        <Board 
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          avatars={avatars}
        />
      </div>

      <div className="game-info">
        <ol>{moves}</ol>
      </div>
      <GameOverPopup 
  winner={winnerPopup}
  onRestart={
    {handleRestart}}
/>

    </div>
    
  );
  
}

function GameOverPopup({ winner, onRestart }) {
  if (!winner) return null;

  return (
    <div className="game-over-overlay">
      <div className="game-over-box">
        <h2>{winner === "Draw" ? "It's a Draw!" : `${winner} Wins!`}</h2>
        <button onClick={onRestart}>Play Again</button>
      </div>
    </div>
  );
}





function Calculatewinner(squares, returnLine = false){
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

  for (let line of lines) {
    const [a,b,c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return returnLine ? line : squares[a];
    }
  }
  return returnLine ? null : null;
}

function AvatarSelector({ player, currentAvatar, onAvatarChange }) {
  const presetAvatars = [
     "/avatars/braidedwoman.jpg",
    "/avatars/manwithglasses.jpg",
    "/avatars/child.jpg",
    "/avatars/youngdark.jpg"
  ];

  return (
    <div className="avatar-selector">
      <label>Player {player} Avatar:</label>
      <div className="avatar-options">
        {presetAvatars.map((avatar, index) => (
          <div
            key={index}
            className={`avatar-option ${currentAvatar === avatar ? 'selected' : ''}`}
            onClick={() => onAvatarChange(avatar)}
          >
            <img src={avatar} alt={`Avatar ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
