import React, { Component } from 'react';
import BoardCell from './boardCell';

class Board extends Component {
  state = {
    rows: Array(9).fill(""),
    winner: ""
  };

  checkBoardWon() {
    const r = this.state.rows;
    let winner = this.state.winner
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
    
    this.setState({winner: winner})
    return winner
  }

  onCellChosen = (cell, owner) => {
    let newRows = this.state.rows;
    newRows[cell] = owner
    this.setState({rows: newRows});
    const winner = this.checkBoardWon()
    this.props.onCellChosen(this.props.board, cell, winner);
  }

  renderBoardCell(cell) {
      return (
        <BoardCell
          player={this.props.player}
          board={this.props.board}
          cell={cell}
          enabled={this.props.enabled}
          onCellChosen={this.onCellChosen}
        />
      );
  }

  render() {
    if (this.state.winner !== "") {
        return (
        <td>
            <table className={this.state.winner}>
                <tbody>
                    <tr>
                        <td>{this.state.winner}</td>
                    </tr>
                </tbody>
            </table>
        </td>);
    } else {
        return (
        <td>
            <table className="board">
            <tbody>
                <tr>
                {this.renderBoardCell(0)}
                {this.renderBoardCell(1)}
                {this.renderBoardCell(2)}
                </tr>
                <tr>
                {this.renderBoardCell(3)}
                {this.renderBoardCell(4)}
                {this.renderBoardCell(5)}
                </tr>
                <tr>
                {this.renderBoardCell(6)}
                {this.renderBoardCell(7)}
                {this.renderBoardCell(8)}
                </tr>
            </tbody>
            </table>
        </td>
        );

    }
  }
}
 
export default Board;