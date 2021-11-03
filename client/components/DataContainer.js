import React, { Component } from 'react';
const axios = require('axios').default; 
import DataBox from './DataBox';

class DataContainer extends Component {
  constructor(props) {
    super(props);
  }

  // componentDidMount() {
  //   this.props.getStockData();
  // }

  render() {
    const dataBoxes = [];
    for (let i = 0; i < this.props.data.stocks.length; i++) {
      console.log('currdataobj from datacontainer', this.props.stockDataObjs[i])
      dataBoxes.push(<DataBox stockData={this.props.stockDataObjs[i]} key={i}/>)
    }
    return (
      <div className="dataContainer">
        <div>{dataBoxes}</div>
      </div>
    );
  }
}

export default DataContainer;