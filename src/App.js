import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import { ToastContainer } from 'react-toastify';
import Main from './components/Main';
import NewGame from './components/NewGame';
import PlayGame from './components/PlayGame';

class App extends Component {
  render() {
    const { store } = this.props;
    return (
      <Container>
        <ToastContainer hideProgressBar />
        <Link to="/">
          <h1>Clew</h1>
        </Link>
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
