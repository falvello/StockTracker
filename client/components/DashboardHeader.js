import React, { Component } from 'react';
const axios = require('axios').default; 
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
        <div> {`Main Dashboard`}</div>
      </div>
    );
  }
}

export default DashboardHeader;
