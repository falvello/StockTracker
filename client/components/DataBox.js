import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
const axios = require('axios').default; 

class DataBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leaders: null
    };
  }
  
  componentDidMount() {
    const requestTest = {
      method: 'GET',
      url: 'https://yfapi.net/v6/finance/quote?region=US&lang=en&symbols=AAPL',
      params: {modules: 'defaultKeyStatistics,assetProfile'},
      headers: {
        'x-api-key': 'grS5nd38br94QBPnU0g6Z2F7Moc9n98I7nk3ar1o',
      }
    };
    
    
    axios.request(requestTest)
    .then(function (response) {
      console.log(response.data);
    }).catch(function (error) {
      console.error(error);
    });

  }
  
  render() {
    if (!this.state.leaders) return null;
    const leaderNames = this.state.leaders.map(leader => <li key={leader.id}>{leader.name}</li>);
    return (
      <div>
        <div>Leaders:</div>
        <ul>{leaderNames}</ul>
      </div>
    );
  }
}

export default DataBox;
