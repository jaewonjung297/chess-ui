import React, { useState, useEffect } from 'react'
import './Board.css'
import io from 'socket.io-client'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ChessPiece from './components/Piece';
import BoardSquare from './components/BoardSquare';

const socket = io('http://localhost:5001'); 

function prettifyBoard(boardData, onDrop) {
    return (
      <div className="board">
        {boardData.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <BoardSquare
              key={`${rowIndex}-${colIndex}`}
              rowIndex={rowIndex}
              colIndex={colIndex}
              onDrop={onDrop}
            >
              <ChessPiece piece={cell} rowIndex={rowIndex} colIndex={colIndex} />
            </BoardSquare>
          ))
        )}
      </div>
    );
  }

function Board() {
  const [boardData, setBoardData] = useState([]);

  useEffect(() => {
    // Fetch the initial board data
    const fetchBoardData = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/board');
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

    // Call the function to fetch the initial data
    fetchBoardData();

    // Set up the WebSocket listener
    socket.on('board_update', (data) => {
      console.log('Board update received:', data);
      setBoardData(data);
    });

    // Clean up the WebSocket listener on component unmount
    return () => {
      socket.off('board_update');
    };
  }, []);

  const handleDrop = async (source, target) => {
    const moveData = {
        startRow: source.rowIndex,
        startCol: source.colIndex,
        endRow: target.rowIndex,
        endCol: target.colIndex,
    }
    try {
        const response = await fetch('http://localhost:5001/api/make-move', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(moveData),
        });
    
        if (response.ok) {
            const result = await response.json();
            console.log('Move Result:', result);
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
        {boardData.length > 0 ? prettifyBoard(boardData, handleDrop) : 'Loading...'}
      </div>
    </DndProvider>
  )
}

export default Board
