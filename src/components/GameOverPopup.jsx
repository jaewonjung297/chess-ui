import React from 'react';
import './GameOverPopup.css';

const GameOverPopup = ({ isVisible, winner, onReset }) => {
  if (!isVisible) return null;

  return (
    <div className="popup">
      <div className="popup-content">
        <h2>Game Over!</h2>
        <p>{winner} wins!</p>
        <button onClick={onReset}>Reset Board</button>
      </div>
    </div>
  );
};

export default GameOverPopup;
