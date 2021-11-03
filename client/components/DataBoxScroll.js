import React, { Component } from 'react';
const axios = require('axios').default; 
import DataBox from './DataBox';

class DataBoxScroll extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const dataBoxes = [];
    for (let i = 0; i < this.props.stockData.length; i++) {
      dataBoxes.push(
        <DataBox 
        stockData={this.props.stockData[i]} 
        stockGraph={this.props.stockGraphs[i]} 
        key={i}/>
      )
    }
    return (
      <div className="dataBoxScroll">
        {dataBoxes}
      </div>
    );
  }
}

export default DataBoxScroll;