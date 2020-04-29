import React, { useState } from 'react';
import './App.css';
import Game from './components/game';

function App() {
  const [playerName, setPlayerName] = useState("");
  const [gameKey, setGameKey] = useState("");
  const [gameLaunched, setGameLaunched] = useState(false);
  const [notice, setNotice] = useState("")
  const [connectionFailureReason, setConnectionFailureReason] = useState("")

  const handlePlayerNameChange = (event) => {
    setPlayerName(event.target.value);
    if (event.target.value === "") {
      setNotice("player name cannot be empty");
    } else {
      setNotice("");
    }
  }
  const handleGameKeyChange = (event) => {
    setGameKey(event.target.value);
  }
  const handleSubmit = (event) => {
    if (playerName !== "") {
      setGameLaunched(true);
    }
  }
  const failedToConnect = (reason) => {
    setGameLaunched(false);
    setConnectionFailureReason(reason);
  }

  const renderGame = (launched) => {
    if (launched) {
      return <Game playerName={playerName} gameKey={gameKey} failedToConnect={failedToConnect}/>;
    } else {
      return (
        <form onSubmit={handleSubmit}>
          <div className="form-group row">
            <small className="form-text text-danger">{notice}</small>
          </div>
          <div className="form-group row">
            <label>Player Name</label>
            <input
              type="text"
              value={playerName}
              onChange={handlePlayerNameChange}
              className="form-control"
            />
            <small className="form-text text-danger">{notice}</small>
          </div>
          <div className="form-group row">
            <label>Game Key</label>
            <input
              type="text"
              value={gameKey}
              onChange={handleGameKeyChange}
              className="form-control"
            />
            <small className="form-text text-muted">
              leave empty to start a new match and get a key to share with
              another player
            </small>
          </div>
          <input type="submit" value="Submit" className="btn btn-primary" />
        </form>
      );
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>XO9: Space Tic-Tac-Toe</h1>
        {renderGame(gameLaunched)}
      </header>
    </div>
  );
}

export default App;
