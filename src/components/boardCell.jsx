import React, { Component } from 'react';

class BoardCell extends Component {
  state = {
    owner: "",
    empty: true,
  };

  setCell = (owner, authority) => {
      console.log("cell", this.props.cell, "setCell(", owner, ")");
      this.setState({ empty: false, owner: owner });
      this.props.onCellChosen(this.props.cell, owner, authority);
  }

  componentDidMount() {
    this.props.onConfigCellSetter(this.props.cell, this.setCell)
  }

  onClick = () => {
    if (!this.props.enabled(this.props.board)) return;
    this.setCell(this.props.player, true);
  }

  renderButton() {
    if (this.state.empty && this.props.enabled) {
      if (this.props.enabled(this.props.board)) {
        return (
          <button onClick={this.onClick}>
            &nbsp;
          </button>
        );
      } else {
        return <button disabled>&nbsp;</button>;
      }
    } else {
      return <div className={this.state.owner}>{this.state.owner}</div>;
    }
  }
  render() {
    return <td>{this.renderButton()}</td>;
  }
}
 
export default BoardCell;