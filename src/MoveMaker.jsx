import React, { useState } from 'react';

function MoveMaker() {
  const [startRow, setStartRow] = useState('');
  const [startCol, setStartCol] = useState('');
  const [endRow, setEndRow] = useState('');
  const [endCol, setEndCol] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const moveData = {
      startRow: parseInt(startRow),
      startCol: parseInt(startCol),
      endRow: parseInt(endRow),
      endCol: parseInt(endCol),
    };

    try {
      const apiUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5001'
      const response = await fetch(`${apiUrl}/api/make-move`, {
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
    <div className="movemaker">
      <h3>Move Maker</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Start Row:</label>
          <input
            type="number"
            value={startRow}
            onChange={(e) => setStartRow(e.target.value)}
          />
        </div>
        <div>
          <label>Start Col:</label>
          <input
            type="number"
            value={startCol}
            onChange={(e) => setStartCol(e.target.value)}
          />
        </div>
        <div>
          <label>End Row:</label>
          <input
            type="number"
            value={endRow}
            onChange={(e) => setEndRow(e.target.value)}
          />
        </div>
        <div>
          <label>End Col:</label>
          <input
            type="number"
            value={endCol}
            onChange={(e) => setEndCol(e.target.value)}
          />
        </div>
        <button type="submit">Move Piece</button>
      </form>
    </div>
  );
}

export default MoveMaker;
