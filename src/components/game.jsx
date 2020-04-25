import React, { Component } from 'react';
import Board from './board'

class Game extends Component {
  state = {
    player: "X",
    myPlayer: "X",
    lastCell: -1,
    boards: Array(9).fill(""),
    winner: "",
  };

  onCellChosen = (cell) => {
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
    this.checkGameWon();
  }

  isCellEnabled = (cell) => {
    return this.state.lastCell === cell || this.state.lastCell === -1; //&& myPlayer === player
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

    this.setState({ winner: winner });
    return winner !== "";
  }

  renderBoard(cell) {
    return (
      <Board
        player={this.state.player}
        cell={cell}
        onCellChosen={this.onCellChosen}
        onBoardWon={this.onBoardWon}
        enabled={this.isCellEnabled}
      />
    );
  }

  render() {
    if (this.state.winner !== "") {
        return <div class={"winner "+this.state.winner}>{this.state.winner} is the winner!</div>
    } else {
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
        <tr><td className={"playerTurn "+this.state.player} colSpan={3}>{this.state.player}, your turn</td></tr>
            </tfoot>
        </table>
        );

    }
  }
}
 
export default Game;