import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import RootStore from './stores/RootStore.js';

const rootStore = new RootStore();

ReactDOM.render(
  <Router>
    <App store={rootStore}/>
  </Router>, document.getElementById('root'));
