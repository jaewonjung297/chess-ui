import React, { useState } from 'react';

const handleSubmit = (e) => {
    e.preventDefault();
    const apiUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5001'
    fetch(`${apiUrl}/api/reset-game`, {
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