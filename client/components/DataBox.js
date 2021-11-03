import React, { Component } from 'react';
const axios = require('axios').default; 
//import fetch from 'isomorphic-fetch';

class DataBox extends Component {
  constructor(props) {
    super(props);
    //this.getStockData = this.getStockData.bind(this);
    //this.stockData;
  }
  
  // getStockData() {
  //   const requestTest = {
  //     method: 'GET',
  //     url: `https://yfapi.net/v6/finance/quote?region=US&lang=en&symbols=${this.props.ticker}`,
  //     params: {modules: 'defaultKeyStatistics,assetProfile'},
  //     headers: {
  //       'x-api-key': 'grS5nd38br94QBPnU0g6Z2F7Moc9n98I7nk3ar1o',
  //     }
  //   };
    
    
  //   axios.request(requestTest)
  //   .then(function (response) {
  //     console.log(response.data);
  //     this.stockData = response.data;
  //   })
  //   .catch(function (error) {
  //     console.error(error);
  //   });
  // }

  componentDidMount() {
  }
  
  render() {
    console.log(this.props.stockData)
    return (
      <div className='dataBox'>
        <div> {`Stock: ${this.props.stockData.displayName}`}</div>
        <div>{`Ask: ${this.props.stockData.ask}`} </div> 
        <div> {`Analyst Rating: ${this.props.stockData.averageAnalystRating}`}</div> 
      </div>
    );
  }
}

export default DataBox;
