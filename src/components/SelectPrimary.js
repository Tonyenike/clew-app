import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Card, Segment } from 'semantic-ui-react';
import SelectableCard from './SelectableCard';

@observer
export default class SelectPrimary extends Component {

  setPrimary(person) {
    this.props.setPrimary(person);
  }

  render() {
    const { people, primary } = this.props;
    const peopleCards = people.map(person => (
      <SelectableCard key={person} title={person}
        selected={primary}
        onSelected={() => this.setPrimary(person)} />
    ));
    return (
      <Segment basic>
        <h4>You are playing as:</h4>
        <Card.Group>
          {primary ?
            <SelectableCard key={primary} title={primary}
              selected={primary} onSelected={() => {this.setPrimary('')}} />
              : peopleCards}
        </Card.Group>
      </Segment>
    );
  }
}
