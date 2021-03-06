import React, { Component, useState, useEffect } from 'react';
const axios = require('axios').default; 
//import fetch from 'isomorphic-fetch';
import LoginBox from './LoginBox';
import LoginText from './LoginText';

// Custom hook for handling input boxes
// saves us from creating onChange handlers for them individually
const useInput = init => {
  const [ value, setValue ] = useState(init);
  const onChange = e => {
    setValue(e.target.value);
  };
  // return the value with the onChange function instead of setValue function
  return [ value, onChange ];
};

class LoginContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  

  render() {
    return (
      <div className="loginContainer">
        <LoginText/>
        <LoginBox
        username={this.props.username} 
        password={this.props.password}
        handleLogin={this.props.handleLogin}
        inputPassword={this.props.inputPassword}
        inputUser={this.props.inputUser}
        key="1" 
        data=""
        />
      </div>
    );
  }
}

export default LoginContainer;