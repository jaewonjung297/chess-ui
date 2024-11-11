import React, { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Board from './Board'
import DashBoard from './components/Dashboard'

function App() {

  return (
    <>
      <div>
        <h1>Chess Game</h1>
      </div>
      <div className="card">
        <Board />
        <DashBoard />
      </div>
    </>
  )
}

export default App
