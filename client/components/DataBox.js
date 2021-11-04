import React, { Component } from 'react';
const axios = require('axios').default; 
import LineGraph from './LineGraph';
//import fetch from 'isomorphic-fetch';

class DataBox extends Component {
  constructor(props) {
    super(props);
  }
  
  componentDidMount() {
  }
  

  render() {
    // Find shortest display name:
    const shortName = this.props.stockData.shortName;
    const displayName = this.props.stockData.displayName;
    let cardTitle = shortName;
    if (shortName.length > displayName.length) cardTitle = displayName;

    return (
      <div className='dataBox'>
        <h1> {`${cardTitle}`}</h1>
        <h2>{`$${this.props.stockData.ask}`} </h2> 
        <div> {`Fifty day average: `}{`$${(Math.round((this.props.stockData.fiftyDayAverage + Number.EPSILON) * 100)) / 100}`}</div> 
        <div> {`Fifty two week high: `}{`$${(Math.round((this.props.stockData.fiftyTwoWeekHigh + Number.EPSILON) * 100)) / 100}`}</div> 
        <div> {`Fifty two week low: `}{`$${(Math.round((this.props.stockData.fiftyTwoWeekLow + Number.EPSILON) * 100)) / 100}`}</div> 
        <LineGraph lineGraphInfo={this.props.stockGraph} key="0"/>
      </div>
    );
  }
}

export default DataBox;
