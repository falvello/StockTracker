import React, { Component } from 'react';
const axios = require('axios').default; 

// import Row from './Row';
import DataContainer from './DataContainer';
import LoginContainer from './LoginContainer';


// const users = {
//   anna : 'hello'
//  }
// import Leaders from './Leaders';

let gameStore = [];

function getInitialState() {
  return {
    currPage: 'login',
    sessionData: '',
    username: '',
    password:'',
    stockDataObjs: [],
  };
}

class App extends Component {
  constructor(props) {
    super(props);
    //this.handleClick = this.handleClick.bind(this);
    this.state = getInitialState();
    this.handleLogin = this.handleLogin.bind(this);
    this.getStockData = this.getStockData.bind(this);
    this.inputPassword = this.inputPassword.bind(this);
    this.inputUser = this.inputUser.bind(this);
    
  }
  
  getStockData() {
    const tickerArr = this.state.sessionData.stocks;
    const requestArr = []
    console.log(tickerArr)
    console.log(tickerArr.length)
    for (let i = 0; i < tickerArr.length; i++) {
    //const stockDataObjs = Object.assign(this.state).stockDataObjs
    const requestInfo = {
      method: 'GET',
      url: `https://yfapi.net/v6/finance/quote?region=US&lang=en&symbols=${tickerArr[i]}`,
      params: {modules: 'defaultKeyStatistics,assetProfile'},
      headers: {
        'x-api-key': 'grS5nd38br94QBPnU0g6Z2F7Moc9n98I7nk3ar1o',
      }
    };
    requestArr.push(axios.request(requestInfo))
    }
    console.log(requestArr.length)
    axios.all(requestArr)
    .then(axios.spread((...responses) => {
      console.log('responses', responses)
      console.log('numofresp', responses.length)
      const stockDataObjs = []
      for (let i = 0; i < responses.length; i++) {
        stockDataObjs.push(responses[i].data.quoteResponse.result[0]);
      }
      const currPage = 'dashboard';
      this.setState({stockDataObjs, currPage})
    }))
    .catch(function (error) {
      console.error(error);
    });
    
  }

  handleLogin(){
    const sessiondata = undefined;
    const currPage = undefined;
    const stockData = undefined;
    const getUser = {
      method: 'GET',
      url: 'http://localhost:3000/verify',
      params: {username: `${this.state.username}`, password: `${this.state.password}`}
    }
    axios.request(getUser)
    .then(res => {
      const sessionData = res.data;
      this.setState({sessionData}, this.getStockData)
    })
    .catch(function (error) {
      console.error(error);
    });

  }

  inputPassword(val){
    this.setState({password : val})
  }

  inputUser(val){
    this.setState({username : val})
  }

  render() {
    // Check if page should display login or data container
    const displayComponent = [];
    if (this.state.currPage === 'login') displayComponent.push(
    <LoginContainer 
      username={this.props.username} 
      password={this.props.password}
      handleLogin={this.handleLogin}
      inputPassword={this.inputPassword}
      inputUser={this.inputUser}
      key="1" 
      data=""/>)

    else if (this.state.currPage === 'dashboard') displayComponent.push(
      <DataContainer 
      className="dataContainer" 
      key="1" 
      getStockData={this.getStockData}
      stockDataObjs={this.state.stockDataObjs}
      data={this.state.sessionData}
      />)
    return (
      <div>
        {displayComponent}
      </div>
    );
  }
}

export default App;