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
      url: 'https://rest.yahoofinanceapi.com/v11/finance/quoteSummary/AAPL',
      params: {modules: 'defaultKeyStatistics,assetProfile'},
      headers: {
        'x-api-key': 'YOUR-PERSONAL-API-KEY'
      }
    };
    
    
    axios.request(options).then(function (response) {
      console.log(response.data);
    }).catch(function (error) {
      console.error(error);
    });

    // After component mounts, aim to retrieve data
    fetch('/api/leaders')
      .then(response => response.json())
      .then(leaders => this.setState({leaders}))
      .catch(console.log('no leaders found'));
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

<<<<<<< HEAD
export default Leaders;
=======
export default Leaders;
>>>>>>> 8ddf3902f82881d8c04773948ef937f79cb2ae5e
