import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Card, Segment } from 'semantic-ui-react';
import SelectableCard from './SelectableCard';

@observer
export default class SelectOpponents extends Component {

  clickPlayer(player) {
    this.props.togglePlayer(player);
  }

  render() {
    const { people, selectedPlayers } = this.props;
    const peopleCards = people.map(person => {
      return (
        <SelectableCard key={person}
          title={person} selected={selectedPlayers.get(person)}
          onSelected={() => this.clickPlayer(person)} />
      );
    });
    return (
      <Segment basic>
        <h4>Your opponents are:</h4>
        <Card.Group>
          {peopleCards}
        </Card.Group>
      </Segment>
    );
  }
}
