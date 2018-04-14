import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import { ToastContainer } from 'react-toastify';
import { Menu } from 'semantic-ui-react';
import Main from './components/Main';
import NewGame from './components/NewGame';
import PlayGame from './components/PlayGame';
import './App.css';

class App extends Component {
  render() {
    const { store } = this.props;
    return (
      <Container className="below-header">
        <ToastContainer hideProgressBar />
        <Menu fixed="top">
          <Link to="/">
            <Menu.Item name="Home" />
          </Link>
          <Link to="/new-game">
            <Menu.Item name="New Game" />
          </Link>
        </Menu>
        <Switch>
          <Route exact={true} path="/" render={() => <Main store={store} />} />
          <Route path="/new-game" render={() => <NewGame store={store} />} />
          <Route path="/play" render={() => <PlayGame store={store} />} />
        </Switch>
      </Container>
    );
  }
}

export default App;
