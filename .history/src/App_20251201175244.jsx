import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'

// Keep your existing Square component unchanged
function Square({value, onSquareClick, highlight, avatars, theme}){
  return(
   <button
      className={`square ${highlight ? "highlight" : ""} ${theme}`}
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

// Keep your existing Board component unchanged
function Board({xIsNext, squares, onPlay, avatars, theme}) {
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
    <div className="board-container">
      <div className={`status ${winner ? "winner" : ""} ${theme}`}>{status}</div>
      <div className={`board-grid ${theme}`}>
        <Square value={squares[0]} onSquareClick={() =>Handleclick(0)} highlight={winningLine?.includes(0)} avatars={avatars} theme={theme}/>
        <Square value={squares[1]} onSquareClick={() =>Handleclick(1)} highlight={winningLine?.includes(1)} avatars={avatars} theme={theme}/>
        <Square value={squares[2]} onSquareClick={() =>Handleclick(2)} highlight={winningLine?.includes(2)} avatars={avatars} theme={theme}/>
        <Square value={squares[3]} onSquareClick={() =>Handleclick(3)} highlight={winningLine?.includes(3)} avatars={avatars} theme={theme}/>
        <Square value={squares[4]} onSquareClick={() =>Handleclick(4)} highlight={winningLine?.includes(4)} avatars={avatars} theme={theme}/>
        <Square value={squares[5]} onSquareClick={() =>Handleclick(5)} highlight={winningLine?.includes(5)} avatars={avatars} theme={theme}/>
        <Square value={squares[6]} onSquareClick={() =>Handleclick(6)} highlight={winningLine?.includes(6)} avatars={avatars} theme={theme}/>
        <Square value={squares[7]} onSquareClick={() =>Handleclick(7)} highlight={winningLine?.includes(7)} avatars={avatars} theme={theme}/>
        <Square value={squares[8]} onSquareClick={() =>Handleclick(8)} highlight={winningLine?.includes(8)} avatars={avatars} theme={theme}/>
      </div>
    </div>
  );
}

// AI Helper Functions
const AIHelper = {
  // Easy AI - Random moves
  easy: (squares) => {
    const emptySquares = squares
      .map((square, index) => square === null ? index : null)
      .filter(val => val !== null);
    
    if (emptySquares.length === 0) return null;
    
    // Add a small delay to make it feel more natural
    return emptySquares[Math.floor(Math.random() * emptySquares.length)];
  },
  
  // Medium AI - Strategy with some intelligence
  medium: (squares, player) => {
    const opponent = player === 'X' ? 'O' : 'X';
    
    // 1. Check for winning move
    for (let i = 0; i < 9; i++) {
      if (squares[i] === null) {
        const testBoard = [...squares];
        testBoard[i] = player;
        if (Calculatewinner(testBoard) === player) {
          return i;
        }
      }
    }
    
    // 2. Block opponent's winning move
    for (let i = 0; i < 9; i++) {
      if (squares[i] === null) {
        const testBoard = [...squares];
        testBoard[i] = opponent;
        if (Calculatewinner(testBoard) === opponent) {
          return i;
        }
      }
    }
    
    // 3. Take center if available
    if (squares[4] === null) {
      return 4;
    }
    
    // 4. Take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => squares[i] === null);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }
    
    // 5. Take edges
    const edges = [1, 3, 5, 7];
    const availableEdges = edges.filter(i => squares[i] === null);
    if (availableEdges.length > 0) {
      return availableEdges[Math.floor(Math.random() * availableEdges.length)];
    }
    
    // Fallback: random move
    return AIHelper.easy(squares);
  },
  
  // Hard AI - Minimax algorithm (unbeatable)
  hard: (squares, player) => {
    const opponent = player === 'X' ? 'O' : 'X';
    
    const minimax = (board, depth, isMaximizing) => {
      const winner = Calculatewinner(board);
      
      if (winner === player) return 10 - depth;
      if (winner === opponent) return depth - 10;
      if (!board.includes(null)) return 0;
      
      if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
          if (board[i] === null) {
            board[i] = player;
            let score = minimax(board, depth + 1, false);
            board[i] = null;
            bestScore = Math.max(score, bestScore);
          }
        }
        return bestScore;
      } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
          if (board[i] === null) {
            board[i] = opponent;
            let score = minimax(board, depth + 1, true);
            board[i] = null;
            bestScore = Math.min(score, bestScore);
          }
        }
        return bestScore;
      }
    };
    
    let bestScore = -Infinity;
    let bestMove = null;
    
    for (let i = 0; i < 9; i++) {
      if (squares[i] === null) {
        squares[i] = player;
        let score = minimax(squares, 0, false);
        squares[i] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    
    return bestMove;
  }
};

export default function Game(){
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  // 🆕 GAME MODE STATE
  const [gameMode, setGameMode] = useState('pvp'); // 'pvp', 'ai'
  const [aiDifficulty, setAiDifficulty] = useState('medium'); // 'easy', 'medium', 'hard'
  const [aiPlayer, setAiPlayer] = useState('O'); // Which player is AI? 'X' or 'O'
  const [isAiThinking, setIsAiThinking] = useState(false);
  
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

  // ACTIVE TAB SELECTION
  const [activeStatsTab, setActiveStatsTab] = useState("X");

  // 🎨 THEME STATE
  const [theme, setTheme] = useState("cyberpunk");

  // 🟦 PLAYER STATISTICS STATE
  const [playerStats, setPlayerStats] = useState({
    X: { 
      wins: 0, 
      losses: 0, 
      draws: 0, 
      totalGames: 0,
      winRate: 0,
      longestWinStreak: 0,
      currentStreak: 0,
      totalMoves: 0,
      averageTimePerMove: 0
    },
    O: { 
      wins: 0, 
      losses: 0, 
      draws: 0, 
      totalGames: 0,
      winRate: 0,
      longestWinStreak: 0,
      currentStreak: 0,
      totalMoves: 0,
      averageTimePerMove: 0
    }
  });

  // 🟦 TIMER STATE
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const timerRef = useRef(null);
  const [totalGameTime, setTotalGameTime] = useState(0);
  const [moveStartTime, setMoveStartTime] = useState(Date.now());

  // 🆕 AI TURN HANDLER
  useEffect(() => {
    // Check if it's AI's turn
    if (gameMode === 'ai' && !xIsNext && aiPlayer === 'O' || 
        gameMode === 'ai' && xIsNext && aiPlayer === 'X') {
      
      const currentPlayer = xIsNext ? 'X' : 'O';
      
      // Only make AI move if game is not over and it's actually AI's turn
      if (!Calculatewinner(currentSquares) && currentSquares.includes(null) && currentPlayer === aiPlayer) {
        setIsAiThinking(true);
        
        // Add a small delay to make it feel more natural
        const aiDelay = aiDifficulty === 'easy' ? 500 : 
                       aiDifficulty === 'medium' ? 700 : 1000;
        
        const aiTimer = setTimeout(() => {
          let aiMoveIndex;
          
          // Get AI move based on difficulty
          switch(aiDifficulty) {
            case 'easy':
              aiMoveIndex = AIHelper.easy(currentSquares);
              break;
            case 'medium':
              aiMoveIndex = AIHelper.medium(currentSquares, aiPlayer);
              break;
            case 'hard':
              aiMoveIndex = AIHelper.hard(currentSquares, aiPlayer);
              break;
            default:
              aiMoveIndex = AIHelper.medium(currentSquares, aiPlayer);
          }
          
          // Make the AI move
          if (aiMoveIndex !== null && aiMoveIndex !== undefined) {
            const nextSquares = currentSquares.slice();
            nextSquares[aiMoveIndex] = aiPlayer;
            
            // Play click sound for AI move
            const ClickSound = new Audio("/sounds/click.mp3.wav");
            ClickSound.play();
            
            handlePlay(nextSquares);
          }
          
          setIsAiThinking(false);
        }, aiDelay);
        
        return () => clearTimeout(aiTimer);
      } else {
        setIsAiThinking(false);
      }
    }
  }, [xIsNext, currentSquares, gameMode, aiPlayer, aiDifficulty]);

  // 🟦 TRACK MOVE TIMES
  useEffect(() => {
    if (!winnerPopup && currentSquares.includes(null)) {
      setMoveStartTime(Date.now());
    }
  }, [currentMove, winnerPopup, currentSquares]);

  // 🟦 UPDATE PLAYER STATISTICS WHEN GAME ENDS
  useEffect(() => {
    if (winnerPopup) {
      const winner = winnerPopup;
      const loser = winnerPopup === "X" ? "O" : "X";
      const moveTime = Date.now() - moveStartTime;
      
      setPlayerStats(prev => {
        const newXStats = { ...prev.X };
        const newOStats = { ...prev.O };
        
        if (winner === "X") {
          // X wins, O loses
          newXStats.wins += 1;
          newXStats.totalGames += 1;
          newXStats.currentStreak += 1;
          newXStats.longestWinStreak = Math.max(newXStats.longestWinStreak, newXStats.currentStreak);
          newXStats.totalMoves += currentMove + 1;
          newXStats.winRate = ((newXStats.wins / newXStats.totalGames) * 100).toFixed(1);
          
          newOStats.losses += 1;
          newOStats.totalGames += 1;
          newOStats.currentStreak = 0;
          newOStats.winRate = ((newOStats.wins / newOStats.totalGames) * 100).toFixed(1);
        } else {
          // O wins, X loses
          newOStats.wins += 1;
          newOStats.totalGames += 1;
          newOStats.currentStreak += 1;
          newOStats.longestWinStreak = Math.max(newOStats.longestWinStreak, newOStats.currentStreak);
          newOStats.totalMoves += currentMove + 1;
          newOStats.winRate = ((newOStats.wins / newOStats.totalGames) * 100).toFixed(1);
          
          newXStats.losses += 1;
          newXStats.totalGames += 1;
          newXStats.currentStreak = 0;
          newXStats.winRate = ((newXStats.wins / newXStats.totalGames) * 100).toFixed(1);
        }
        
        return {
          X: newXStats,
          O: newOStats
        };
      });
    } else if (winnerPopup === null && !currentSquares.includes(null)) {
      // Draw game
      const moveTime = Date.now() - moveStartTime;
      
      setPlayerStats(prev => {
        const newXStats = { ...prev.X };
        const newOStats = { ...prev.O };
        
        newXStats.draws += 1;
        newXStats.totalGames += 1;
        newXStats.currentStreak = 0;
        newXStats.totalMoves += currentMove + 1;
        newXStats.winRate = ((newXStats.wins / newXStats.totalGames) * 100).toFixed(1);
        
        newOStats.draws += 1;
        newOStats.totalGames += 1;
        newOStats.currentStreak = 0;
        newOStats.totalMoves += currentMove + 1;
        newOStats.winRate = ((newOStats.wins / newOStats.totalGames) * 100).toFixed(1);
        
        return {
          X: newXStats,
          O: newOStats
        };
      });
    }
  }, [winnerPopup, currentMove, moveStartTime, currentSquares]);

  // 🟦 TIMER EFFECT
  useEffect(() => {
    // Don't start timer if it's AI's turn in AI mode
    if (gameMode === 'ai') {
      const currentPlayer = xIsNext ? 'X' : 'O';
      if (currentPlayer === aiPlayer) {
        // It's AI's turn, don't start timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        return;
      }
    }
    
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
  }, [currentSquares, isTimerActive, xIsNext, gameMode, aiPlayer]);

  // 🟦 Reset timer when move changes
  useEffect(() => {
    setTimeLeft(30);
  }, [currentMove]);

  function handlePlay(nextSquares) {
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

    const winner = Calculatewinner(nextSquares);
    if (winner) {
      setWinnerPopup(winner);
      setIsTimerActive(false);
      setScore(prev => ({
        ...prev,
        [winner]: prev[winner] + 1
      }));
    } else if (!nextSquares.includes(null)) {
      setWinnerPopup("Draw");
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
    setIsAiThinking(false);
  }

  // 🟦 RESTART FUNCTION - Reset timer too
  const handleRestart = () => {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setWinnerPopup(null);
    setTimeLeft(30);
    setIsTimerActive(true);
    setIsAiThinking(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  // Time travel move list
  const moves = history.map((squares, move) => {
    let description = move > 0 ? "Go to move #" + move : "Go to game start";
    return (
      <li key={move}>
        <button className={theme} onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className={`game-container ${theme}`}>
      <header className={`game-header ${theme}`}>
        <h1 className="game-title">🎮 Tic Tac Toe Champions</h1>
        <div className="header-subtitle">Classic Game with Modern Twist</div>
      </header>

      {/* 🆕 AI THINKING INDICATOR */}
      {isAiThinking && (
        <div className="ai-thinking-indicator">
          <div className="ai-thinking-content">
            <div className="thinking-dots">
              <span>🤖</span>
              <span className="dot">.</span>
              <span className="dot">.</span>
              <span className="dot">.</span>
            </div>
            <p>AI is thinking ({aiDifficulty} mode)</p>
          </div>
        </div>
      )}

      <div className="game-content">
        {/* LEFT SIDEBAR - Game Controls & Info */}
        <div className="sidebar left-sidebar">
          {/* 🆕 GAME MODE SELECTOR */}
          <div className={`control-section game-mode-section ${theme}`}>
            <h3 className="section-title">🎮 Game Mode</h3>
            <div className="game-mode-selector">
              <div 
                className={`mode-option ${gameMode === 'pvp' ? 'active' : ''} ${theme}`}
                onClick={() => {
                  setGameMode('pvp');
                  setIsAiThinking(false);
                  if (timerRef.current) clearInterval(timerRef.current);
                  setTimeout(() => setIsTimerActive(true), 100);
                }}
              >
                <div className="mode-icon">👥</div>
                <span>Player vs Player</span>
              </div>
              <div 
                className={`mode-option ${gameMode === 'ai' ? 'active' : ''} ${theme}`}
                onClick={() => {
                  setGameMode('ai');
                  setIsAiThinking(false);
                  handleRestart();
                }}
              >
                <div className="mode-icon">🤖</div>
                <span>Player vs AI</span>
              </div>
            </div>
            
            {/* 🆕 AI SETTINGS (only show in AI mode) */}
            {gameMode === 'ai' && (
              <div className="ai-settings">
                <div className="setting-group">
                  <h4 className="setting-title">AI Difficulty</h4>
                  <div className="difficulty-options">
                    <div 
                      className={`difficulty-option ${aiDifficulty === 'easy' ? 'active' : ''} ${theme}`}
                      onClick={() => setAiDifficulty('easy')}
                    >
                      <span className="difficulty-dot easy"></span>
                      Easy
                    </div>
                    <div 
                      className={`difficulty-option ${aiDifficulty === 'medium' ? 'active' : ''} ${theme}`}
                      onClick={() => setAiDifficulty('medium')}
                    >
                      <span className="difficulty-dot medium"></span>
                      Medium
                    </div>
                    <div 
                      className={`difficulty-option ${aiDifficulty === 'hard' ? 'active' : ''} ${theme}`}
                      onClick={() => setAiDifficulty('hard')}
                    >
                      <span className="difficulty-dot hard"></span>
                      Hard
                    </div>
                  </div>
                </div>
                
                <div className="setting-group">
                  <h4 className="setting-title">Play as</h4>
                  <div className="player-options">
                    <div 
                      className={`player-option ${aiPlayer === 'O' ? 'active' : ''} ${theme}`}
                      onClick={() => {
                        setAiPlayer('O');
                        handleRestart();
                      }}
                    >
                      <img src={avatars.X} alt="Player X" className="option-avatar" />
                      <span>X (Human)</span>
                      <span className="player-badge">You</span>
                    </div>
                    <div 
                      className={`player-option ${aiPlayer === 'X' ? 'active' : ''} ${theme}`}
                      onClick={() => {
                        setAiPlayer('X');
                        handleRestart();
                      }}
                    >
                      <img src={avatars.O} alt="Player O" className="option-avatar" />
                      <span>O (Human)</span>
                      <span className="player-badge">You</span>
                    </div>
                  </div>
                </div>
                
                <div className="ai-info">
                  <p className="ai-description">
                    {aiDifficulty === 'easy' && '🤖 AI makes random moves'}
                    {aiDifficulty === 'medium' && '🤖 AI uses basic strategy'}
                    {aiDifficulty === 'hard' && '🤖 AI uses advanced strategy (unbeatable)'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Theme Selector */}
          <div className="control-section theme-section">
            <h3 className="section-title">🎨 Theme Selector</h3>
            <div className="theme-selector">
              <div className="theme-options">
                <div 
                  className={`theme-option ${theme === "cyberpunk" ? "active" : ""}`}
                  onClick={() => setTheme("cyberpunk")}
                  data-theme="cyberpunk"
                >
                  <div className="theme-preview cyberpunk"></div>
                  <span>Cyberpunk</span>
                </div>
                <div 
                  className={`theme-option ${theme === "neon" ? "active" : ""}`}
                  onClick={() => setTheme("neon")}
                  data-theme="neon"
                >
                  <div className="theme-preview neon"></div>
                  <span>Neon</span>
                </div>
                <div 
                  className={`theme-option ${theme === "sunset" ? "active" : ""}`}
                  onClick={() => setTheme("sunset")}
                  data-theme="sunset"
                >
                  <div className="theme-preview sunset"></div>
                  <span>Sunset</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timer Section */}
          <div className={`control-section timer-section ${theme}`}>
            <h3 className="section-title">⏱️ Game Timer</h3>
            <div className="timer-display">
              <div className={`timer-circle ${timeLeft <= 10 ? 'warning' : ''} ${theme}`}>
                <span className="timer-value">{timeLeft}s</span>
                <div className="timer-progress" style={{ width: `${(timeLeft/30)*100}%` }}></div>
              </div>
              <button 
                className={`timer-btn ${theme}`}
                onClick={() => setIsTimerActive(!isTimerActive)}
              >
                {isTimerActive ? "⏸️ Pause" : "▶️ Resume"}
              </button>
            </div>
          </div>

          {/* Avatar Selection */}
          <div className={`control-section avatar-section ${theme}`}>
            <h3 className="section-title">👤 Player Avatars</h3>
            <div className="avatar-selection-grid">
              <AvatarSelector 
                player="X" 
                currentAvatar={avatars.X}
                onAvatarChange={(avatar) => setAvatars(prev => ({...prev, X: avatar}))}
                theme={theme}
              />
              <AvatarSelector 
                player="O" 
                currentAvatar={avatars.O}
                onAvatarChange={(avatar) => setAvatars(prev => ({...prev, O: avatar}))}
                theme={theme}
              />
            </div>
          </div>

          {/* Game History */}
          <div className={`control-section history-section ${theme}`}>
            <h3 className="section-title">📜 Game History</h3>
            <div className="history-list">
              <ol>{moves}</ol>
            </div>
          </div>
        </div>

        {/* MAIN GAME BOARD */}
        <div className="main-game-area">
          <div className="game-board-wrapper">
            <div className={`game-board ${Calculatewinner(currentSquares) ? "winner" : ""} ${theme}`}>
              {/* 🆕 Display who is AI in the status */}
              <div className={`ai-indicator ${theme}`}>
                {gameMode === 'ai' && (
                  <div className="ai-labels">
                    <div className={`ai-label ${aiPlayer === 'X' ? 'ai' : 'human'}`}>
                      {aiPlayer === 'X' ? '🤖 AI' : '👤 Human'}
                    </div>
                    <div className="ai-label-vs">VS</div>
                    <div className={`ai-label ${aiPlayer === 'O' ? 'ai' : 'human'}`}>
                      {aiPlayer === 'O' ? '🤖 AI' : '👤 Human'}
                    </div>
                  </div>
                )}
              </div>
              
              <Board 
                xIsNext={xIsNext}
                squares={currentSquares}
                onPlay={handlePlay}
                avatars={avatars}
                theme={theme}
              />
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR - Stats & Score */}
        <div className="sidebar right-sidebar">
          {/* Scoreboard */}
          <div className={`control-section scoreboard-section ${theme}`}>
            <h3 className="section-title">🏆 Live Scoreboard</h3>
            <div className="scoreboard-cards">
              <div className={`score-card player-x-score ${theme}`}>
                <div className="score-avatar">
                  <img src={avatars.X} alt="Player X" />
                  {gameMode === 'ai' && aiPlayer === 'X' && <div className="ai-badge">🤖</div>}
                </div>
                <div className="score-info">
                  <h4>Player X {gameMode === 'ai' && aiPlayer === 'X' ? '(AI)' : ''}</h4>
                  <div className="score-value">{score.X}</div>
                  <div className="score-label">Wins</div>
                </div>
              </div>
              
              <div className={`score-card draws-score ${theme}`}>
                <div className="score-info">
                  <h4>Draws</h4>
                  <div className="score-value">{score.Draws}</div>
                </div>
              </div>
              
              <div className={`score-card player-o-score ${theme}`}>
                <div className="score-avatar">
                  <img src={avatars.O} alt="Player O" />
                  {gameMode === 'ai' && aiPlayer === 'O' && <div className="ai-badge">🤖</div>}
                </div>
                <div className="score-info">
                  <h4>Player O {gameMode === 'ai' && aiPlayer === 'O' ? '(AI)' : ''}</h4>
                  <div className="score-value">{score.O}</div>
                  <div className="score-label">Wins</div>
                </div>
              </div>
            </div>
          </div>

          {/* Player Statistics */}
          <div className={`control-section stats-section ${theme}`}>
            <h3 className="section-title">📊 Player Statistics</h3>
            
            {/* Tab Selection */}
            <div className="player-tabs">
              <div 
                className={`player-tab ${activeStatsTab === "X" ? "active" : ""} ${theme}`}
                onClick={() => setActiveStatsTab("X")}
                data-player="X"
              >
                <img src={avatars.X} alt="Player X" className="tab-avatar" />
                <span>Player X</span>
              </div>
              <div 
                className={`player-tab ${activeStatsTab === "O" ? "active" : ""} ${theme}`}
                onClick={() => setActiveStatsTab("O")}
                data-player="O"
              >
                <img src={avatars.O} alt="Player O" className="tab-avatar" />
                <span>Player O</span>
              </div>
            </div>
            
            {/* X Player Stats */}
            <div className={`player-stats ${activeStatsTab === "X" ? "active" : ""} ${theme}`} id="stats-X">
              <div className="stats-grid">
                <div className={`stat-box ${theme}`}>
                  <div className={`stat-icon ${theme}`}>🎯</div>
                  <div className="stat-content">
                    <div className="stat-value">{playerStats.X.winRate}%</div>
                    <div className="stat-label">Win Rate</div>
                  </div>
                </div>
                <div className={`stat-box ${theme}`}>
                  <div className={`stat-icon ${theme}`}>🔥</div>
                  <div className="stat-content">
                    <div className="stat-value">{playerStats.X.currentStreak}</div>
                    <div className="stat-label">Current Streak</div>
                  </div>
                </div>
                <div className={`stat-box ${theme}`}>
                  <div className={`stat-icon ${theme}`}>📈</div>
                  <div className="stat-content">
                    <div className="stat-value">{playerStats.X.longestWinStreak}</div>
                    <div className="stat-label">Best Streak</div>
                  </div>
                </div>
                <div className={`stat-box ${theme}`}>
                  <div className={`stat-icon ${theme}`}>📊</div>
                  <div className="stat-content">
                    <div className="stat-value">{playerStats.X.totalGames}</div>
                    <div className="stat-label">Games Played</div>
                  </div>
                </div>
              </div>
              
              <div className={`detailed-stats ${theme}`}>
                <div className="detailed-stat">
                  <span>Wins</span>
                  <span className="stat-number win">{playerStats.X.wins}</span>
                </div>
                <div className="detailed-stat">
                  <span>Losses</span>
                  <span className="stat-number loss">{playerStats.X.losses}</span>
                </div>
                <div className="detailed-stat">
                  <span>Draws</span>
                  <span className="stat-number">{playerStats.X.draws}</span>
                </div>
              </div>
            </div>
            
            {/* O Player Stats */}
            <div className={`player-stats ${activeStatsTab === "O" ? "active" : ""} ${theme}`} id="stats-O">
              <div className="stats-grid">
                <div className={`stat-box ${theme}`}>
                  <div className={`stat-icon ${theme}`}>🎯</div>
                  <div className="stat-content">
                    <div className="stat-value">{playerStats.O.winRate}%</div>
                    <div className="stat-label">Win Rate</div>
                  </div>
                </div>
                <div className={`stat-box ${theme}`}>
                  <div className={`stat-icon ${theme}`}>🔥</div>
                  <div className="stat-content">
                    <div className="stat-value">{playerStats.O.currentStreak}</div>
                    <div className="stat-label">Current Streak</div>
                  </div>
                </div>
                <div className={`stat-box ${theme}`}>
                  <div className={`stat-icon ${theme}`}>📈</div>
                  <div className="stat-content">
                    <div className="stat-value">{playerStats.O.longestWinStreak}</div>
                    <div className="stat-label">Best Streak</div>
                  </div>
                </div>
                <div className={`stat-box ${theme}`}>
                  <div className={`stat-icon ${theme}`}>📊</div>
                  <div className="stat-content">
                    <div className="stat-value">{playerStats.O.totalGames}</div>
                    <div className="stat-label">Games Played</div>
                  </div>
                </div>
              </div>
              
              <div className={`detailed-stats ${theme}`}>
                <div className="detailed-stat">
                  <span>Wins</span>
                  <span className="stat-number win">{playerStats.O.wins}</span>
                </div>
                <div className="detailed-stat">
                  <span>Losses</span>
                  <span className="stat-number loss">{playerStats.O.losses}</span>
                </div>
                <div className="detailed-stat">
                  <span>Draws</span>
                  <span className="stat-number">{playerStats.O.draws}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Over Popup */}
      <GameOverPopup 
        winner={winnerPopup}
        onRestart={handleRestart}
        theme={theme}
        gameMode={gameMode}
        aiDifficulty={aiDifficulty}
      />
    </div>
  );
}

function GameOverPopup({ winner, onRestart, theme, gameMode, aiDifficulty }) {
  if (!winner) return null;

  return (
    <div className="game-over-overlay">
      <div className={`game-over-box ${theme}`}>
        <div className="celebration">🎉</div>
        <h2>{winner === "Draw" ? "It's a Draw!" : `${winner} Wins!`}</h2>
        
        {gameMode === 'ai' && winner !== "Draw" && (
          <div className="ai-result-message">
            {winner === "X" ? "👤 Human" : "🤖 AI"} wins!
            <div className="ai-difficulty-tag">{aiDifficulty} mode</div>
          </div>
        )}
        
        <p className="popup-message">Great game! Ready for another round?</p>
        <button className={`restart-btn ${theme}`} onClick={onRestart}>🎮 Play Again</button>
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

function AvatarSelector({ player, currentAvatar, onAvatarChange, theme }) {
  const presetAvatars = [
    "/avatars/braidedwoman.jpg",
    "/avatars/manwithglasses.jpg",
    "/avatars/child.jpg",
    "/avatars/youngdark.jpg"
  ];

  return (
    <div className={`avatar-selector-compact ${theme}`}>
      <div className="player-label">Player {player}</div>
      <div className="current-avatar">
        <img src={currentAvatar} alt={`Current ${player}`} />
      </div>
      <div className="avatar-options-compact">
        {presetAvatars.map((avatar, index) => (
          <div
            key={index}
            className={`avatar-option-compact ${currentAvatar === avatar ? 'selected' : ''} ${theme}`}
            onClick={() => onAvatarChange(avatar)}
          >
            <img src={avatar} alt={`Avatar ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
}