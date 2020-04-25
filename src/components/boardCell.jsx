import React, { Component } from 'react';

class BoardCell extends Component {
  state = {
    owner: "",
    empty: true,
  };

  onClick = () => {
    if (!this.props.enabled(this.props.board)) return;
    this.setState({
      empty: false,
      owner: this.props.player,
    });
    this.props.onCellChosen(this.props.cell, this.props.player);
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