import React, { Component } from 'react';
const axios = require('axios').default; 

// import Row from './Row';
import DashboardHeader from './DashboardHeader';
import DataContainer from './DataContainer';
import LoginContainer from './LoginContainer';


// const users = {
//   anna : 'hello'
//  }
// import Leaders from './Leaders';

let gameStore = [];

function getInitialState() {
  return {
    username: '',
    password:'',
    currPage: 'login',
    sessionData: '',
    stockDataObjs: [],
    stockGraphObjs: [],

    // TODO: Uncomment temporary state to avoid unnecessary fetches
    //currPage: 'dashboard',
    // sessionData: {
    //   id : '1',
    //   stocks: ['AAPL', 'MSFT', 'TSLA', 'CUK']
    // },
    // stockDataObjs: [{},{},{}, {}],
    // stockGraphObjs: [{},{},{}, {}],

  };
}

class App extends Component {
  constructor(props) {
    super(props);
    // Methods for log in
    this.state = getInitialState();
    this.inputPassword = this.inputPassword.bind(this);
    this.inputUser = this.inputUser.bind(this);
    this.handleLogin = this.handleLogin.bind(this);

    // Methods to fetch data from Yahoo API
    this.getStockData = this.getStockData.bind(this);
    this.getGraphData = this.getGraphData.bind(this);

    // Methods to switch react component
    this.goToDashboard = this.goToDashboard.bind(this);
    this.goToHome = this.goToHome.bind(this);  
  }

  componentDidMount(){this.handleLogin()}
  handleLogin(){
    const sessiondata = undefined;
    const currPage = undefined;
    const stockData = undefined;
    const getUser = {
      method: 'GET',
      url: 'http://localhost:3000/verify',

      // TODO: Uncomment below after test
      //params: {username: `${this.state.username}`, password: `${this.state.password}`}
      params: {username: 'jemmy', password: 'go'}
    }
    axios.request(getUser)
    .then(res => {
      // TODO: Uncomment below after test
      const sessionData = res.data;
      // const sessionData = {
      //     id : '1',
      //     stocks: ['AAPL']
      //   }
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

  getStockData() {
    const tickerArr = this.state.sessionData.stocks;
    const requestArr = []

    for (let i = 0; i < tickerArr.length; i++) {
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
    axios.all(requestArr)
    .then(axios.spread((...responses) => {
      const stockDataObjs = []
      for (let i = 0; i < responses.length; i++) {
        stockDataObjs.push(responses[i].data.quoteResponse.result[0]);
      }
      this.setState({stockDataObjs}, this.getGraphData)
    }))
    .catch(function (error) {
      console.error(error);
    });
    // TODO: Uncomment temporary state to avoid unnecessary fetches
    // const stockDataObjs = [{},{},{}];
    // const currPage = 'dashboard';
    // this.setState({stockDataObjs, currPage})
  }

  getGraphData() {
    const tickerArr = this.state.sessionData.stocks;
    const requestArr = []

    for (let i = 0; i < tickerArr.length; i++) {
    const requestInfo = {
      method: 'GET',
      url: `https://yfapi.net/v8/finance/chart/${tickerArr[i]}?range=1mo&region=US&interval=1d&lang=en&events=div%2Csplit`,
      params: {modules: 'defaultKeyStatistics,assetProfile'},
      headers: {
        'x-api-key': 'grS5nd38br94QBPnU0g6Z2F7Moc9n98I7nk3ar1o',
      }
    };
    requestArr.push(axios.request(requestInfo))
    }
    axios.all(requestArr)
    .then(axios.spread((...responses) => {
      const stockGraphObjs = []
      for (let i = 0; i < responses.length; i++) {
        const quotesObj = responses[i].data.chart.result[0].indicators.quote[0];
        stockGraphObjs.push(
          {
            closeArr: quotesObj.close,
            highArr: quotesObj.high,
            lowArr: quotesObj.low,
            openArr: quotesObj.open,
            volumeArr: quotesObj.volume,
          });
      }
      this.setState({stockGraphObjs}, this.goToDashboard)
    }))
    .catch(function (error) {
      console.error(error);
    });
    // TODO: Uncomment temporary state to avoid unnecessary fetches
    // const stockDataObjs = [{},{},{}];
    // const currPage = 'dashboard';
    // this.setState({stockDataObjs, currPage})
  }

  goToHome() {
    const currPage = 'login';
    this.setState({currPage})
  }

  goToDashboard() {
    const currPage = 'dashboard';
    this.setState({currPage})
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

    else if (this.state.currPage === 'dashboard') {
      displayComponent.push(
        <DashboardHeader key="0"/>
      )
      displayComponent.push(
        <DataContainer 
        className="dataContainer" 
        key="1" 
        getStockData={this.getStockData}
        stockDataObjs={this.state.stockDataObjs}
        stockGraphObjs={this.state.stockGraphObjs}
        data={this.state.sessionData}/>
      )
      }
    return (
      <div>
        {displayComponent}
      </div>
    );
  }
}

export default App;