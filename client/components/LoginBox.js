import React, { Component, useState, useEffect } from 'react';
const axios = require('axios').default; 
//import fetch from 'isomorphic-fetch';

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

class LoginBox extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  

  render() {
    return (
      <div className="loginBox">
        <div>log in / sign up</div>
        <input
        onChange={(e) => { this.props.inputUser(e.target.value) }}
        type="text"
        placeholder="username"
        value={this.props.username}
        />
        <input
        onChange={(e) => { this.props.inputPassword(e.target.value) }}
        type="password"
        placeholder="password"
        value={this.props.password}
        />
        <button id="login" onClick={() => this.props.handleLogin()}>{'enter'}</button>
      </div>
    );
  }
}

export default LoginBox;