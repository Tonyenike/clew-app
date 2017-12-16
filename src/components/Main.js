import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';

@observer
export default class Main extends Component {
  render() {
    return <Link to="/new-game">New Game</Link>;
  }
}
