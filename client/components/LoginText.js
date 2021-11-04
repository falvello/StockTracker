import React, { Component, useState, useEffect } from 'react';
const axios = require('axios').default; 
//import fetch from 'isomorphic-fetch';

class LoginText extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  

  render() {
    return (
      <span className="loginText">
        Portfolio <span><h3>is a web based application that allows you to track all your favorite stocks and keep up to date with trending stocks </h3></span>
      </span>
    );
  }
}

export default LoginText;