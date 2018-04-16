import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Tab } from 'semantic-ui-react';
import PlayTurn from './PlayTurn';
import Notebook from './Notebook';
import TurnLog from './TurnLog';

@observer
export default class PlayGame extends Component {

  panes = [
    {
      menuItem: 'Play Turn',
      pane: { key: 'playTurn', content: <PlayTurn store={this.props.store} /> },
    },
    {
      menuItem: 'Notebook',
      pane: { key: 'brain', content: <Notebook store={this.props.store} /> },
    },
    {
      menuItem: 'Turn Log',
      pane: { key: 'turnLog', content: <TurnLog store={this.props.store} /> },
    },
  ];

  render() {
    return (
      <Tab panes={this.panes} renderActiveOnly={false} />
    );
  }
}
