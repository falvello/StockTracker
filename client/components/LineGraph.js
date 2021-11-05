import React, { Component } from 'react';
const axios = require('axios').default; 
import { Line, Scatter } from 'react-chartjs-2';
//import fetch from 'isomorphic-fetch';

class LineGraph extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    // Convert this.props.timeArr to usable data. Entries come formatted in s, ex: 1623139200
    const unformattedArr = this.props.lineGraphInfo.timeArr;
    const daysArr = [];
    for (let i = 0; i < unformattedArr.length; i++) {
      const date = new Date(unformattedArr[i] * 1000)
      const day = date.getDate(); // Extract day.
      const month = date.getMonth() + 1; // Extract month.
      daysArr.push(`${month}/${day}`)
    }

    const graphInfo = {
      labels: daysArr,
      datasets: [
        {
          label: '',
          fill: true,
          lineTension: 0.1,
          pointRadius: 0,
          backgroundColor: 'rgba(252,214,103)',
          borderColor: 'rgba(0,0,0,1)',
          borderWidth: 0,
          data: this.props.lineGraphInfo.closeArr,
        }
      ]
    }
    return (
      <div className='lineGraph'>
        <Line
        data={graphInfo}
        options={{
            plugins: {
              legend: {
                display: false,
                position: "right",
                align: "start",
                labels: {
                  usePointStyle: true,
                },
              },
            },
          legend: {
              maxWidth: 0,
              labels: {boxWidth: 0, boxHeight: 0, color: 'rgba(0,0,0,1)'},
              title: {display: false}
           }
        }}

        />
      </div>
    );
  }
}

export default LineGraph;
