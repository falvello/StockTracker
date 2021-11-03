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
    tickerTrends: [],

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
    this.getTrending = this.getTrending.bind(this);

    // Methods to switch react component
    this.goToDashboard = this.goToDashboard.bind(this);
    this.goToHome = this.goToHome.bind(this);  
  }

  componentDidMount(){}

  handleLogin(){
    const sessiondata = undefined;
    const currPage = undefined;
    const stockData = undefined;
    const getUser = {
      method: 'GET',
      url: 'http://localhost:3000/verify',

      // TODO: Uncomment below after test
      params: {username: `${this.state.username}`, password: `${this.state.password}`}
      //params: {username: 'jemmy', password: 'go'}
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
      this.setState({stockGraphObjs}, this.getTrending)
    }))
    .catch(function (error) {
      console.error(error);
    });
    // TODO: Uncomment temporary state to avoid unnecessary fetches
    // const stockDataObjs = [{},{},{}];
    // const currPage = 'dashboard';
    // this.setState({stockDataObjs, currPage})
  }

  getTrending() {
    // const requestInfo = {
    //   method: 'GET',
    //   url: `https://yfapi.net/v1/finance/trending/US`,
    //   params: {modules: 'defaultKeyStatistics,assetProfile'},
    //   headers: {
    //     'x-api-key': 'grS5nd38br94QBPnU0g6Z2F7Moc9n98I7nk3ar1o',
    //   }
    // };

    // axios.request(requestInfo)
    // .then(trendingResults => {
    //   const trendingObjArr = trendingResults.data.finance.result[0].quotes;
    //   const trendingTickerArr = trendingObjArr.map(el => el.symbol);
    //   console.log('popularTickers', trendingTickerArr);
    //   const requestArr = []
    //   for (let i = 0; i < trendingTickerArr.length; i++) {
    //     const requestInfo = {
    //       method: 'GET',
    //       url: `https://yfapi.net/v6/finance/quote?region=US&lang=en&symbols=${trendingTickerArr[i]}`,
    //       params: {modules: 'defaultKeyStatistics,assetProfile'},
    //       headers: {'x-api-key': 'grS5nd38br94QBPnU0g6Z2F7Moc9n98I7nk3ar1o'}
    //     };
    //     requestArr.push(axios.request(requestInfo))
    //   }
    //   axios.all(requestArr)
    //     .then(axios.spread((...responses) => {
    //       const tickerTrends = [];
    //       for (let i = 0; i < responses.length; i++) {
    //           tickerTrends.push([
    //           `${trendingTickerArr[i].toUpperCase()}.: `,
    //           `CHANGE: ${(Math.round((responses[i].data.quoteResponse.result[0].regularMarketChangePercent + Number.EPSILON) * 100)) / 100}% `,
    //           `VAL: $${responses[i].data.quoteResponse.result[0].ask} `]);
    //         }
    //         console.log(tickerTrends)
    //       this.setState({tickerTrends}, this.goToDashboard)
    //     }))
    //   }).catch(error => {
    //   console.error(error);
    // });
    // TODO: Uncomment temporary state to avoid unnecessary fetches
    let tickerTrends = [['Z.: ', 'CHANGE: -24.92% ', 'VAL: $65.53 ']
    ,['BIRD.: ', 'CHANGE: 92.6% ', 'VAL: $27.94 ']
    ,['BBBY.: ', 'CHANGE: 15.22% ', 'VAL: $19.31 ']
    ,['ATVI.: ', 'CHANGE: -14.06% ', 'VAL: $66.72 ']
    ,['QS.: ', 'CHANGE: 8.69% ', 'VAL: $31.61 ']
    ,['IRTC.: ', 'CHANGE: 59.01% ', 'VAL: $122.5 ']
    ,['PTPI.: ', 'CHANGE: 64.57% ', 'VAL: $3.02 ']
    ,['TDOC.: ', 'CHANGE: 4.66% ', 'VAL: $154.29 ']
    ,['GME.: ', 'CHANGE: 5.48% ', 'VAL: $218 ']
    ,['SKLZ.: ', 'CHANGE: 7.32% ', 'VAL: $12.78 ']
    ,['NNOX.: ', 'CHANGE: 13.13% ', 'VAL: $27.05 ']
    ,['F.: ', 'CHANGE: 3.44% ', 'VAL: $18.64 ']
    ,['APPS.: ', 'CHANGE: -19.01% ', 'VAL: $73.74 ']
    ,['QCOM.: ', 'CHANGE: 2.4% ', 'VAL: $138.74 ']
    ,['AMZN.: ', 'CHANGE: 2.15% ', 'VAL: $3381 ']
    ,['AI.: ', 'CHANGE: 8.17% ', 'VAL: $49.55 ']
    ,['FATBB.: ', 'CHANGE: 99.23% ', 'VAL: $12.94 ']
    ,['ZG.: ', 'CHANGE: -22.95% ', 'VAL: $65.74 ']
    ,['CL=F.: ', 'CHANGE: -4.54% ', 'VAL: $80.11 ']
    ,['FIGS.: ', 'CHANGE: 23.2% ', 'VAL: $42.18 ']]
    this.setState({tickerTrends}, this.goToDashboard)
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
        <DashboardHeader 
        key="0"
        user={this.state.username}
        tickerData={this.state.tickerTrends}/>
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