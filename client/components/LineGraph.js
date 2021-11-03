import React, { Component } from 'react';
const axios = require('axios').default; 
import { Line, Scatter } from 'react-chartjs-2';
//import fetch from 'isomorphic-fetch';

class LineGraph extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    //console.log(this.props.lineGraphInfo)
    const graphInfo = {
      labels: [1,2,3,4,5,6,7,8,9,10,11,12,13],
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
              title: {fisplay: false}
           }
        }}

        />
      </div>
    );
  }
}

export default LineGraph;
