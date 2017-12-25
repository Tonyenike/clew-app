import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Card, Segment } from 'semantic-ui-react';
import SelectableCard from './SelectableCard';

@observer
export default class SelectOpponents extends Component {

  clickCard(card) {
    this.props.toggleCard(card);
  }

  render() {
    const { people, weapons, rooms, selectedCards } = this.props;
    const peopleCards = people.map(person => {
      return (
        <SelectableCard key={person}
          title={person} selected={selectedCards.get(person)}
          onSelected={() => this.clickCard(person)} />
      );
    });
    const weaponCards = weapons.map(weapon => {
      return (
        <SelectableCard key={weapon}
          title={weapon} selected={selectedCards.get(weapon)}
          onSelected={() => this.clickCard(weapon)} />
      );
    });
    const roomCards = rooms.map(room => {
      return (
        <SelectableCard key={room}
          title={room} selected={selectedCards.get(room)}
          onSelected={() => this.clickCard(room)} />
      );
    });
    return (
      <Segment basic>
        <h4>Select your cards:</h4>
        <h5>People</h5>
        <Card.Group>
          {peopleCards}
        </Card.Group>
        <h5>Weapons</h5>
        <Card.Group>
          {weaponCards}
        </Card.Group>
        <h5>Rooms</h5>
        <Card.Group>
          {roomCards}
        </Card.Group>
      </Segment>
    );
  }
}
