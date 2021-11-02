import React, { Component } from 'react';
const axios = require('axios').default; 
//import fetch from 'isomorphic-fetch';

class LoginContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }
  
  componentDidMount() {
    // const requestTest = {
    //   method: 'GET',
    //   url: 'https://yfapi.net/v6/finance/quote?region=US&lang=en&symbols=AAPL',
    //   params: {modules: 'defaultKeyStatistics,assetProfile'},
    //   headers: {
    //     'x-api-key': 'grS5nd38br94QBPnU0g6Z2F7Moc9n98I7nk3ar1o',
    //   }
    // };
    
    
    // axios.request(requestTest)
    // .then(function (response) {
    //   console.log(response.data);
    // })
    // .catch(function (error) {
    //   console.error(error);
    // });

  }
  
  render() {
    return (
      <div className="loginContainer">
        <div>Login Container</div>
      </div>
    );
  }
}

export default LoginContainer;