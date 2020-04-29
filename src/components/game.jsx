import React, { Component } from 'react';
import socketIoClient from "socket.io-client";
import Board from './board';

class Game extends Component {
  state = {
    player: "",
    myPlayer: "X",
    players: {},
    gameKey: "",
    lastCell: -1,
    boards: Array(9).fill(""),
    winner: "",
    socket: null,
    boardSetters: Array(9)
  };

  componentDidMount() {
    const socket = socketIoClient(this.props.endpoint);
    socket.on('your-move', (player)=> {
      this.setState({player: player});
    });
    socket.on('room', (roomName, player) => {
        this.setState({gameKey: roomName, myPlayer: player});
    });
    socket.on('no-room', ()=>{
        socket.disconnect()
        this.props.failedToConnect("no game found");
    });
    socket.on('move', (player, board, cell) => {
        console.log("move:", player, board, cell)
        this.setCell(board, cell, player, false);
    })

    //this.setState({players: })
    if (this.props.gameKey) {
        this.setState({
            myPlayer: "O",
            players: {player: "O", name: this.props.playerName}
        });
        socket.emit('join-game', this.props.gameKey, this.props.playerName);
    } else {
        this.setState({
            myPlayer: "X",
            players: {player: "X", name: this.props.playerName}
        });
        socket.emit("new-game", this.props.playerName);
    }
    this.setState({socket: socket});
  }

  setCell = (board, cell, owner) => {
      console.log("Game.setCell():", board, cell, owner);
      this.state.boardSetters[board](cell, owner);
  }

  onConfigCellSetter = (board, setter) => {
    let setters = this.state.boardSetters;
    setters[board] = setter
    this.setState({boardSetters: setters})
  }

  onCellChosen = (board, cell, winner, authority) => {
    if (authority) {
        this.state.socket.emit("move", board, cell);
    }
    if (this.state.winner !== "")
    {
        this.setState({ lastCell: -2 });
        return;
    } else if (winner !== "") {
        this.onBoardWon(board, winner)
        if (this.checkGameWon()) {
            return;
        }
    }
    console.log("cell chosen", cell, "- state:", this.state.boards[cell]);
    if (this.state.boards[cell] === "") {
        this.setState({ lastCell: cell });
    } else {
        this.setState({ lastCell: -1 });
    }
    
    if (this.state.player === "X") {
      this.setState({ player: "O" });
    } else {
      this.setState({ player: "X" });
    }
  }

  onBoardWon = (board, winner) => {
    let boards = this.state.boards;
    boards[board] = winner;
    this.setState({ boards: boards });
    console.log("setting board", board, "to", winner);
  }

  isCellEnabled = (cell) => {
    return (this.state.lastCell === cell || this.state.lastCell === -1) && this.state.myPlayer === this.state.player;
  }

  checkGameWon = () => {
    const r = this.state.boards;
    let winner = this.state.winner;
    // check rows
    if (r[0] !== "" && r[0] === r[1] && r[0] === r[2]) {
      winner = r[0];
    } else if (r[3] !== "" && r[3] === r[4] && r[3] === r[5]) {
      winner = r[3];
    } else if (r[6] !== "" && r[6] === r[7] && r[6] === r[8]) {
      winner = r[6];
    }
    // check columns
    else if (r[0] !== "" && r[0] === r[3] && r[0] === r[6]) {
      winner = r[0];
    } else if (r[1] !== "" && r[1] === r[4] && r[1] === r[7]) {
      winner = r[1];
    } else if (r[2] !== "" && r[2] === r[5] && r[2] === r[8]) {
      winner = r[2];
    }
    // check crosses
    else if (r[0] !== "" && r[0] === r[4] && r[0] === r[8]) {
      winner = r[0];
    } else if (r[2] !== "" && r[2] === r[4] && r[2] === r[6]) {
      winner = r[2];
    }

    this.setState({ winner: winner, lastCell: winner===""?this.state.lastCell:-2 });
    return winner !== "";
  }

  renderBoard(board) {
    return (
      <Board
        player={this.state.player}
        board={board}
        onCellChosen={this.onCellChosen}
        enabled={this.isCellEnabled}
        onConfigCellSetter={this.onConfigCellSetter}
      />
    );
  }

  renderFooter() {
    if (this.state.winner !== "") {
        return (
          <td className={"winner " + this.state.winner} colSpan={3}>
            {this.state.winner} is the winner!
          </td>
        );
    } else if (this.state.player !== "") {
        return (
          <td className={"playerTurn " + this.state.player} colSpan={3}>
            {this.state.player}, your turn
          </td>
        );
    } else {
        return (<td colSpan={3}>
            game key: {this.state.gameKey}
        </td>)
    }
  }

  render() {
    return (
    <table>
        <tbody>
            <tr>
                {this.renderBoard(0)}
                {this.renderBoard(1)}
                {this.renderBoard(2)}
            </tr>
            <tr>
                {this.renderBoard(3)}
                {this.renderBoard(4)}
                {this.renderBoard(5)}
            </tr>
            <tr>
                {this.renderBoard(6)}
                {this.renderBoard(7)}
                {this.renderBoard(8)}
            </tr>
        </tbody>
        <tfoot>
            <tr>{this.renderFooter()}</tr>
        </tfoot>
    </table>
    );
  }
}
 
export default Game;