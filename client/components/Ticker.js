import React, { Component } from 'react';
const axios = require('axios').default; 
//import fetch from 'isomorphic-fetch';

class Ticker extends Component {
  constructor(props) {
    super(props);
  }
 

  componentDidMount() {
  }
  
  render() {
    // This.props.tickerData is an array of arrays
    // If it had only one element, it would look like this: [ ['BBBY.: ', 'CHANGE: 15.22% ', 'VAL: $19.31 '] ]
    const stylizedTicker = [];
    for (let i = 0; i < this.props.tickerData.length; i++){
      const element = this.props.tickerData[i]
      // Adjust change color according to gain / loss
      const gain = element[1].split(' ')[1];
      let chosenColor = ""; // Will be set to either red or green depending on loss or gian
      gain[0] === '-' ? chosenColor = "#FCD667" : chosenColor = "#AAF0D1";

      //Backup Red "#FFB97B"
      // Make stock name show slightly bold
      stylizedTicker.push(<span style={{fontWeight: 'normal', color: chosenColor}}>{element[0]}</span>);
      stylizedTicker.push(<span style={{fontWeight: 'thin', color: chosenColor}}>{element[1]}</span>);
      stylizedTicker.push(<span style={{fontWeight: 'thin', color: chosenColor}}>{element[2]} | </span>);
    }
    return (
        <div className="marquee">{stylizedTicker}</div>
    );
  }
}

export default Ticker;
