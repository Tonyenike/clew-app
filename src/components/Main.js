import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Button, Container } from 'semantic-ui-react';
import './Main.css';

@observer
export default class Main extends Component {
  render() {
    return (
      <Container className="hero center aligned text">
        <h1>Clew</h1>
        <Link to="/new-game">
          <Button size="massive" primary>
            New Game
          </Button>
        </Link>
        <Link to="/play">
          <Button size="massive" secondary>
            Resume Game
          </Button>
        </Link>
      </Container>
    );
  }
}
