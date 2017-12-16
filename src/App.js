import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { Container } from 'semantic-ui-react';
import Main from './components/Main';
import NewGame from './components/NewGame';

class App extends Component {
  render() {
    const { store } = this.props;
    return (
      <Container>
        <h1>Clew</h1>
        <Switch>
          <Route exact={true} path="/" render={() => <Main store={store} />} />
          <Route path="/new-game" render={() => <NewGame store={store} />} />
        </Switch>
      </Container>
    );
  }
}

export default App;
