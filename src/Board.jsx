import React, { useState, useEffect } from 'react'
import './Board.css'
import io from 'socket.io-client'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ChessPiece from './components/Piece';
import BoardSquare from './components/BoardSquare';
import GameOverPopup from './components/GameOverPopup';

const apiUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5001'
const socket = io(apiUrl); 

function prettifyBoard(boardData, onDrop, selectedPosition, handleSquareClick, isAnimating, validMoves) {
  return (
    <div className="board">
      {boardData.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isSelected =
            selectedPosition &&
            selectedPosition.row === rowIndex &&
            selectedPosition.col === colIndex;
            const isValidMove = validMoves.some(move => move[0] === rowIndex && move[1] === colIndex);
          
            return (
            <BoardSquare
              key={`${rowIndex}-${colIndex}`}
              rowIndex={rowIndex}
              colIndex={colIndex}
              onDrop={onDrop}
              piece={cell}
              isSelected={isSelected} // Pass down the selected state
              onClick={() => handleSquareClick(rowIndex, colIndex, cell)}
              isValidMove={isValidMove}
            >
              <ChessPiece piece={cell} rowIndex={rowIndex} colIndex={colIndex} isAnimating={isAnimating && isSelected} />
            </BoardSquare>
          );
        })
      )}
    </div>
  );
}


function Board() {
  const [boardData, setBoardData] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [validMoves, setValidMoves] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/board`);
        if (response.ok) {
          const data = await response.json();
          setBoardData(data);
        } else {
          console.error('Failed to fetch initial board data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching initial board data:', error);
      }
    };

    fetchBoardData();

    socket.on('board_update', (data) => {
      setBoardData(data);
    });
    socket.on('game_over', (data) => {
      setWinner(data);
      setIsGameOver(true);
    });

    return () => {
      socket.off('board_update');
      socket.off('game_over');
    };
  }, []);
  const resetBoard = (e) => {
    e.preventDefault();
    const apiUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5001'
    fetch(`${apiUrl}/api/reset-game`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(() => {
    setIsGameOver(false);
    setWinner(null);
  })
};

  const handleSquareClick = async (row, col, piece) => {
    //first check if you already have a piece selected. if so, move that piece
    if (selectedPosition) {
      const moveData = {
        startRow: selectedPosition.row,
        startCol: selectedPosition.col,
        endRow: row,
        endCol: col,
      }
      try {
        const response = await fetch(`${apiUrl}/api/make-move`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(moveData),
        });
    
        if (response.ok) {
            const result = await response.json();
            setSelectedPosition(null)
            setValidMoves([])
        } else {
            console.error('Failed to make move:', response.statusText);
        }
        } catch (error) {
            console.error('Error making move:', error);
        }
    }

    if (piece !== 'X') {
      if (selectedPosition && selectedPosition.row === row && selectedPosition.col === col) {
        setSelectedPosition(null);
        setValidMoves([])
        return;
      }
  
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
  
      setSelectedPosition({ row, col });
  
      try {
        const response = await fetch(`${apiUrl}/api/valid-moves`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            piece,
            position: { row, col },
          }),
        });
  
        if (response.ok) {
          const data = await response.json();
          const moves = JSON.parse(data.valid_moves.replace(/\(/g, "[").replace(/\)/g, "]")); // Parse the string into an array
          setValidMoves(moves);
        } else {
          console.error('Failed to fetch valid moves:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching valid moves:', error);
      }
    } else {
      setSelectedPosition(null);
    }
  };
  
  const handleDrop = async (source, target) => {
    const moveData = {
        startRow: source.rowIndex,
        startCol: source.colIndex,
        endRow: target.rowIndex,
        endCol: target.colIndex,
    }
    try {
        const response = await fetch(`${apiUrl}/api/make-move`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(moveData),
        });
    
        if (response.ok) {
            const result = await response.json();
            console.log(result);
            setSelectedPosition(null)
            setValidMoves([])
        } else {
            console.error('Failed to make move:', response.statusText);
        }
    } catch (error) {
        console.error('Error making move:', error);
      }
    };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="card">
        <GameOverPopup isVisible={isGameOver} winner={winner} onReset={resetBoard} />
        {boardData.length > 0 ? prettifyBoard(boardData, handleDrop, selectedPosition, handleSquareClick, isAnimating, validMoves) : 'Loading...'}
      </div>
    </DndProvider>
  )
}

export default Board
