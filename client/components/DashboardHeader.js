import React, { Component } from 'react';
const axios = require('axios').default; 
import Ticker from './Ticker';
import DashboardActions from './DashboardActions';

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
        <DashboardActions
        inputStock={this.props.inputStock}
        addNewStock={this.props.addNewStock}
        />
      </div>
    );
  }
}

export default DashboardHeader;
