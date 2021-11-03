import React, { Component } from 'react';
const axios = require('axios').default; 
import DataBoxScroll from './DataBoxScroll';


class DataContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const dataBoxScroll = [
      <DataBoxScroll 
      stockData={this.props.stockDataObjs} 
      stockGraphs={this.props.stockGraphObjs} 
      key={1}/>
    ]

    return (
      <div className="dataContainer">
        <div className="leftScroll">{"↫"}</div>
        {dataBoxScroll}
        <div className="rightScroll">{"↬"}</div>
      </div>
    );
  }
}

export default DataContainer;