import React, { Component } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
const axios = require('axios').default; 

// import Row from './Row';
import DashboardHeader from './DashboardHeader';
import DataContainer from './DataContainer';
import LoginContainer from './LoginContainer';
import LoginText from './LoginText';


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
    newStock: '',
    // sessionData: '',
    // stockDataObjs: [],
    // stockGraphObjs: [],
    // tickerTrends: [],

    // TODO: Uncomment temporary state to avoid unnecessary fetches
    //currPage: 'dashboard',
    // sessionData: {
    //   id : '1',
    //   stocks: ['AAPL', 'MSFT', 'TSLA', 'CUK']
    // },
    //stockDataObjs: [{}],
    //stockGraphObjs: [{}],
    // tickerTrends: [,,,]

  };
}



class App extends Component {
  constructor(props) {
    super(props);
    // Methods for log in
    this.state = getInitialState();

    this.props.sessionData = '';
    this.props.stockDataObjs = [];
    this.props.stockGraphObjs = [];
    this.props.tickerTrends = [];

    this.inputPassword = this.inputPassword.bind(this);
    this.inputUser = this.inputUser.bind(this);
    this.inputStock = this.inputStock.bind(this);

    // Methods to interact with database
    this.handleLogin = this.handleLogin.bind(this);
    this.addNewStock = this.addNewStock.bind(this);
    this.deleteStock = this.deleteStock.bind(this);

    // Methods to fetch data from Yahoo API
    this.getStockData = this.getStockData.bind(this);
    this.getGraphData = this.getGraphData.bind(this);
    this.getTrending = this.getTrending.bind(this);

    // Methods to switch react component
    this.goToDashboard = this.goToDashboard.bind(this);
    this.goToHome = this.goToHome.bind(this);  
  }


  inputPassword(val){
    this.setState({password : val})
  }

  inputUser(val){
    this.setState({username : val})
  }

  inputStock(val) {
    this.setState({newStock : val})
  }

  handleLogin(){
    const sessiondata = undefined;
    const currPage = undefined;
    const stockData = undefined;
    const getUserRequest = {
      method: 'GET',
      url: 'http://localhost:3000/verify',

      // TODO: Uncomment below after test
      params: {username: `${this.state.username}`, password: `${this.state.password}`}
      //params: {username: 'jemmy', password: 'go'}
    }
    axios.request(getUserRequest)
    .then(res => {
      // TODO: Uncomment below after test
      const sessionData = res.data;
      this.props.sessionData = sessionData;
      return this.getTrending();

      // this.setState({sessionData}, unstable_batchedUpdates(()=> {
      //   this.getStockData(sessionData);
      //   this.getGraphData(sessionData);
      //   this.getTrending();
      //   this.goToDashboard();
      // }))

    })
    .catch(function (error) {
      console.error(error);
    });

  }

  addNewStock() {
    const addStockRequest = {
      method: 'GET',
      url: 'http://localhost:3000/addstock',
      params: {username: `${this.state.username}`, stock: `${this.state.newStock}`}
    }

    axios.request(addStockRequest)
    .then(res => {
      const sessionData = res.data;
      const newStock = '';
      this.props.sessionData = sessionData;
      this.getStockData();
    })
  }

  deleteStock(stockSymbol) {
    console.log("deletingstock")
    const deleteStockRequest = {
      method: 'POST',
      url: 'http://localhost:3000/deletestock',
      params: {username: `${this.state.username}`, symbol: stockSymbol}
    }

    axios.request(deleteStockRequest)
    .then(res => {
      const sessionData = res.data;
      this.props.sessionData = sessionData;
      this.getStockData();
    })
  }

  getStockData() {
    const tickerArr = this.props.sessionData.stocks;
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
    console.log('stock requests', requestArr)
    axios.all(requestArr)
    .then(axios.spread((...responses) => {
      console.log('response from stock', responses);
      const stockDataObjs = []
      for (let i = 0; i < responses.length; i++) {
        stockDataObjs.push(responses[i].data.quoteResponse.result[0]);
      }
      console.log('stockdataobjs', stockDataObjs)
      this.props.stockDataObjs = stockDataObjs;
      this.getGraphData();
    }))
    .catch(function (error) {
      console.error(error);
    });
    // TODO: Uncomment temporary state to avoid unnecessary fetches
    // const stockDataObjs = [{}];
    // this.setState({stockDataObjs}, this.getGraphData)
  }

  getGraphData() {
    const tickerArr = this.props.sessionData.stocks;
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
        const timesArr = responses[i].data.chart.result[0].timestamp;
        const quotesObj = responses[i].data.chart.result[0].indicators.quote[0];
        stockGraphObjs.push(
          {
            closeArr: quotesObj.close,
            highArr: quotesObj.high,
            lowArr: quotesObj.low,
            openArr: quotesObj.open,
            volumeArr: quotesObj.volume,
            timeArr: timesArr, // Will be an array with entries formatted in ms, ex: 1623139200
          });
      }
      this.props.stockGraphObjs = stockGraphObjs;
      this.goToDashboard();
    }))
    .catch(function (error) {
      console.error(error);
    });
    // TODO: Uncomment temporary state to avoid unnecessary fetches
    // const stockGraphObjs = [{}];
    // const currPage = 'dashboard';
    // this.setState({stockGraphObjs, currPage})
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
    //       this.props.tickerTrends = tickerTrends;
    //       return this.getStockData();
    //     }))
    //   }).catch(error => {
    //   console.error(error);
    // });
    // TODO: Uncomment temporary state to avoid unnecessary fetches
    let tickerTrends =  
      [['NVDA.: ', 'CHANGE: 14.95% ', 'VAL: $302.45 '],
      ['MRNA.: ', 'CHANGE: -18.98% ', 'VAL: $279.71 '],
      ['PENN.: ', 'CHANGE: -21.9% ', 'VAL: $56.7 '],
      ['SAVA.: ', 'CHANGE: 48.57% ', 'VAL: $81.18 '],
      ['QCOM.: ', 'CHANGE: 12.92% ', 'VAL: $156.98 '],
      ['T.: ', 'CHANGE: -2.24% ', 'VAL: $24.63 '] ,
      ['NKLA.: ', 'CHANGE: 18.17% ', 'VAL: $14.86 '],
      ['LSPD.TO.: ', 'CHANGE: -28.41% ', 'VAL: $87.93 '],
      ['DKNG.: ', 'CHANGE: -5.96% ', 'VAL: $44.07 '],
      ['PATH.: ', 'CHANGE: 7.38% ', 'VAL: $58.4 '],
      ['COST.: ', 'CHANGE: 3.14% ', 'VAL: $518.52 '],
      ['LSPD.: ', 'CHANGE: -28.74% ', 'VAL: $70.45 '],
      ['VZ.: ', 'CHANGE: -2.93% ', 'VAL: $51.36 '],
      ['NRDS.: ', 'CHANGE: 57.78% ', 'VAL: $27.5 '],
      ['AMZN.: ', 'CHANGE: 3.23% ', 'VAL: $3483.66 '],
      ['ROKU.: ', 'CHANGE: -8.5% ', 'VAL: $287.59 '],
      ['TTD.: ', 'CHANGE: -5.31% ', 'VAL: $72.09 '],
      ['ETSY.: ', 'CHANGE: 15.41% ', 'VAL: $275.33 '],
      ['EVAX.: ', 'CHANGE: 144.46% ', 'VAL: $16.4 '],
      ['BGFV.: ', 'CHANGE: 8.13% ', 'VAL: $33.57 ']];
    this.props.tickerTrends = tickerTrends;
    return this.getStockData();
  }

  goToHome() {
    const currPage = 'login';
    this.setState({currPage})
  }

  goToDashboard() {
    const currPage = 'dashboard';
    const newStock = '';
    this.setState({currPage, newStock})
  }

  render() {
    // Check if page should display login or data container
    const displayComponent = [];
    if (this.state.currPage === 'login') {
      displayComponent.push(
      <LoginContainer 
        username={this.props.username} 
        password={this.props.password}
        handleLogin={this.handleLogin}
        inputPassword={this.inputPassword}
        inputUser={this.inputUser}
        key="1" 
        data=""/>)
    }
    else if (this.state.currPage === 'dashboard') {
      displayComponent.push(
        <DashboardHeader 
        key="0"
        user={this.state.username}
        tickerData={this.props.tickerTrends}
        inputStock={this.inputStock}
        addNewStock={this.addNewStock}
        />
      )
      displayComponent.push(
        <DataContainer 
        className="dataContainer" 
        key="1" 
        getStockData={this.getStockData}
        deleteStock={this.deleteStock}
        stockDataObjs={this.props.stockDataObjs}
        stockGraphObjs={this.props.stockGraphObjs}
        data={this.props.sessionData}/>
      )
      }
    return (
      <div className="application">
        {displayComponent}
      </div>
    );
  }
}

export default App;