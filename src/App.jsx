
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [board, setBoard] = useState(Array(3).fill(Array(3).fill('')));
  const [winner, setWinner] = useState(null);
  const [isUser1Turn, setIsUser1Turn] = useState(true); // Track whose turn it is

  const handleCellClick = async (row, col) => {
    if (board[row][col] !== '' || winner) return;

    // Player's move (User 1)
    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = 'X';
    setBoard(newBoard);

    // Check for winner
    const winnerCheck = checkWinner(newBoard);
    if (winnerCheck) {
      setWinner(winnerCheck);
      return;
    }

    // Switch to User 2's turn (AI)
    setIsUser1Turn(false);

    // AI's move (User 2)
    const response = await axios.post('http://localhost:5000/api/move', { board: newBoard });
    const { row: aiRow, col: aiCol } = response.data.move;
    newBoard[aiRow][aiCol] = 'O';
    setBoard(newBoard);

    // Check for winner after AI's move
    const aiWinnerCheck = checkWinner(newBoard);
    if (aiWinnerCheck) {
      setWinner(aiWinnerCheck);
    }

    // Switch back to User 1's turn
    setIsUser1Turn(true);
  };

  const checkWinner = (board) => {
    const lines = [
      [[0, 0], [0, 1], [0, 2]],
      [[1, 0], [1, 1], [1, 2]],
      [[2, 0], [2, 1], [2, 2]],
      [[0, 0], [1, 0], [2, 0]],
      [[0, 1], [1, 1], [2, 1]],
      [[0, 2], [1, 2], [2, 2]],
      [[0, 0], [1, 1], [2, 2]],
      [[0, 2], [1, 1], [2, 0]],
    ];

    for (const line of lines) {
      const [a, b, c] = line;
      if (
        board[a[0]][a[1]] !== '' &&
        board[a[0]][a[1]] === board[b[0]][b[1]] &&
        board[a[0]][a[1]] === board[c[0]][c[1]]
      ) {
        return board[a[0]][a[1]];
      }
    }

    if (board.flat().every(cell => cell !== '')) {
      return 'tie';
    }

    return null;
  };

  return (
    <div className="App">
      <h1>Tic-Tac-Toe</h1>
      <div className="board">
        {board.map((row, i) => (
          <div key={i} className="row">
            {row.map((cell, j) => (
              <div key={j} className="cell" onClick={() => handleCellClick(i, j)}>
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
      {winner && <h2>{winner === 'tie' ? 'It\'s a tie!' : `${winner} wins!`}</h2>}
    </div>
  );
};

export default App;