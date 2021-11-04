import React, { Component } from 'react';
const axios = require('axios').default; 
import Ticker from './Ticker';
//import fetch from 'isomorphic-fetch';

class DashboardHeader extends Component {
  constructor(props) {
    super(props);
  }
 

  componentDidMount() {
  }
  
  render() {
    return (
      <div className='dashboardHeader'>
        <Ticker tickerData={this.props.tickerData}/>
        <div className='dashboardTitle'> {`Welcome, ${this.props.user}`}</div>
      </div>
    );
  }
}

export default DashboardHeader;
