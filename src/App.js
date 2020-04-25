import React from 'react';
import './App.css';
import Game from './components/game';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>XO9: Space Tic-Tac-Toe</h1>
        <Game />
      </header>
    </div>
  );
}

export default App;
