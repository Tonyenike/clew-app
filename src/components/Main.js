import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Button, Container, Icon } from 'semantic-ui-react';
import './Main.css';

@observer
export default class Main extends Component {
  render() {
    return (
      <Container className="hero center aligned text">
        <h1><Icon name="spy" />Clew</h1>
        <h3>Your canny Clue&trade; assistant</h3>
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
