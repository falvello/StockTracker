import React, { Component } from 'react';
const axios = require('axios').default; 
// import Row from './Row';
import DataBox from './DataBox';
import DataContainer from './DataContainer';
import LoginContainer from './LoginContainer';
// import Leaders from './Leaders';

let gameStore = [];

function getInitialState() {
  return {
    currPage: 'login',
    currSession: '',
    rows: [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ],
    turn: 'X',
    winner: undefined,
    gameList: gameStore,
  };
}

class App extends Component {
  constructor(props) {
    super(props);
    //this.handleClick = this.handleClick.bind(this);
    this.state = getInitialState();
  }
  
  // handleClick(row, square) {
  //   let { turn, winner } = this.state;
  //   const { rows } = this.state;
  //   const squareInQuestion = rows[row][square];

  //   if (this.state.winner) return;
  //   if (squareInQuestion) return;

  //   rows[row][square] = turn;
  //   turn = turn === 'X' ? 'O' : 'X';

  //   this.setState({
  //     rows,
  //     turn,
  //     winner,
  //   });
  // }

  render() {
    // Check if page should display login or data container
    const displayComponent = [];
    if (this.state.currPage === 'login') displayComponent.push(<LoginContainer key="1" data=""/>)
    //else displayComponent.push(<DataContainer className="dataContainer" key="1" data=""/>)

    return (
      <div>
        {displayComponent}
        <button id="reset" onClick={() => this.setState(getInitialState())}>Reset board</button>
      </div>
    );
  }
}

export default App;