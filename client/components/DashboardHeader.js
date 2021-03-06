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
        user={this.props.user}
        inputStock={this.props.inputStock}
        newStock={this.props.newStock}
        addNewStock={this.props.addNewStock}
        />
      </div>
    );
  }
}

export default DashboardHeader;
