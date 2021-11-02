import React from 'react';
import { render } from 'react-dom';
import App from './components/App';

import styles from './scss/application.scss';
//console.log('environment', process.env.NODE_ENV);

render(<App />, document.querySelector('#root'));
