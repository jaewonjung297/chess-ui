import React, { useState } from 'react';

const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5001/api/reset-game', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })};

function DashBoard() {
    return (
        <button onClick={handleSubmit}>Reset Game</button>
    )
}
export default DashBoard