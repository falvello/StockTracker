import e from 'express';
import React, { Component } from 'react';
const axios = require('axios').default; 


// Custom hook for handling input boxes
// saves us from creating onChange handlers for them individually
// const useInput = init => {
//   const [ value, setValue ] = useState(init);
//   const onChange = e => {
//     setValue(e.target.value);
//   };
//   // return the value with the onChange function instead of setValue function
//   return [ value, onChange ];
// };

class DashboardActions extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='dashboardActions'>
        <div className='dashboardTitle'> {`Welcome, ${this.props.user}`}</div>
        <input
        className="searchStock"
        onChange={(e) => { this.props.inputStock(e.target.value) }}
        //onKeyDown={this.props.addNewStock()}
        type="text"
        placeholder="add stock"
        value={this.props.newStock}
        />
      </div>
    );
  }
}

export default DashboardActions;
