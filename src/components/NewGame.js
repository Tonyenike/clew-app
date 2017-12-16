import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Step } from 'semantic-ui-react';
import SelectPrimary from './SelectPrimary';
import SelectPlayers from './SelectPlayers';

@observer
export default class NewGame extends Component {

  @observable steps = [
    { title: 'Select a player', active: true, completed: false },
    { title: 'Select opponents', active: false, completed: false }
  ];

  selectedPlayers = observable.map({});
  @observable primary;

  setPrimary(person) {
    this.primary = person;
    this.steps[0].completed = true;
    this.steps[0].active = false;
    this.steps[1].active = true;
  }

  togglePlayer(player) {
    this.selectedPlayers.set(player, !this.selectedPlayers.get(player));
  }

  render() {
    const { store: { cardStore: { people } } } = this.props;
    const stepsElements = this.steps.map((step, idx) => (
      <Step key={idx} active={step.active} completed={step.completed} title={step.title} />
    ));
    const selectPlayers = (
      <SelectPlayers people={people.filter(person => person !== this.primary)}
        selectedPlayers={this.selectedPlayers}
        togglePlayer={player => this.togglePlayer(player)} />
    );
    return (
      <div>
        <Step.Group ordered>
          {stepsElements}
        </Step.Group>
        <SelectPrimary people={people} primary={this.primary} setPrimary={person => this.setPrimary(person)} />
        {this.steps[1].active && selectPlayers}
      </div>
    );
  }
}

