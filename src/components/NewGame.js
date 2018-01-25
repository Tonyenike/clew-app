import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Button, Segment, Step } from 'semantic-ui-react';
import * as _ from 'lodash';
import PlayerCardCount from './PlayerCardCount';
import SelectPrimary from './SelectPrimary';
import SelectOpponents from './SelectOpponents';
import SelectCards from './SelectCards';

@withRouter
@observer
export default class NewGame extends Component {

  @observable selectedPlayers = new Map();
  @observable primaryCardsMap = new Map();
  @observable playerCardCounts = new Map();
  @observable primary;

  validCardCounts = new Map([
    [6, [3, 3, 3, 3, 3, 3]],
    [5, [3, 3, 4, 4, 4]],
    [4, [4, 4, 5, 5]],
    [3, [6, 6, 6]],
  ]);

  @observable steps = [
    {
      title: 'Select a player',
      active: true,
      completed: computed(() => !!this.primary),
      component: () => {
        const { store: { cardStore: { people } } } = this.props;
        return (
          <SelectPrimary people={people}
            primary={this.primary}
            setPrimary={person => this.setPrimary(person)} />
        );
      },
    },
    {
      title: 'Select opponents',
      active: false,
      completed: computed(() => this.countSelectedPlayers > 1),
      component: () => {
        const { store: { cardStore: { people } } } = this.props;
        return (
          <SelectOpponents people={people.filter(person => person !== this.primary)}
            selectedPlayers={this.selectedPlayers}
            togglePlayer={player => this.togglePlayer(player)} />
        );
      },
    },
    {
      title: 'Cards per player',
      active: false,
      completed: computed(() => this.cardCountsValid),
      component: () => {
        return (
          <PlayerCardCount players={this.allPlayers}
            playerCardCounts={this.playerCardCounts}
            validCardCounts={this.validCardCounts}
            onCountChange={(player, value) => this.setCardCount(player, value)} />
        );
      }
    },
    {
      title: 'Select your cards',
      active: false,
      completed: computed(() =>
        this.primaryCards.length === this.playerCardCounts.get(this.primary)),
      component: () => {
        const { store: { cardStore: { people, weapons, rooms } } } = this.props;
        return (
          <SelectCards people={people}
            weapons={weapons}
            rooms={rooms}
            selectedCards={this.primaryCardsMap}
            toggleCard={card => this.toggleCard(card)} />
        );
      }
    },
  ];

  @computed get countSelectedPlayers() {
    return [...this.selectedPlayers].filter(entry => entry[1]).length;
  }

  @computed get allPlayers() {
    const players = [...this.selectedPlayers].filter(entry => entry[1])
                                             .map(entry => entry[0]);
    players.push(this.primary);
    return players;
  }

  @computed get cardCountsValid() {
    const playerCount = this.allPlayers.length;
    const counts = [...this.playerCardCounts].map(entry => entry[1])
                                             .sort((a, b) => a - b);
    return _.isEqual(counts, this.validCardCounts.get(playerCount));
  }

  @computed get primaryCards() {
    return [...this.primaryCardsMap].filter(entry => entry[1])
                                  .map(entry => entry[0]);
  }

  setPrimary(person) {
    this.primary = person;
    if (person) {
      this.steps[0].active = false;
      this.steps[1].active = true;
    } else {
      this.steps[0].active = true;
      this.steps[1].active = false;
    }
  }

  setCardCount(person, count) {
    this.playerCardCounts.set(person, count);
  }

  togglePlayer(player) {
    this.selectedPlayers.set(player, !this.selectedPlayers.get(player));
  }

  toggleCard(card) {
    this.primaryCardsMap.set(card, !this.primaryCardsMap.get(card));
  }

  nextStep(activeIndex) {
    if (activeIndex+1 < this.steps.length) {
      this.steps[activeIndex].active = false;
      this.steps[activeIndex+1].active = true;
    }
  }

  previousStep(activeIndex) {
    if (activeIndex > 1) {
      this.steps[activeIndex].active = false;
      this.steps[activeIndex-1].active = true;
    }
  }

  startGame = () => {
    const {
      store: {
        gameStore,
        cardStore: {
          people,
          weapons,
          rooms,
        }
      }
    } = this.props;
    const game = {
      primaryPlayer: this.primary,
      players: this.allPlayers.map(name => {
        let player = {
          name: name,
          cardCount: this.playerCardCounts.get(name),
        };

        if (name === this.primary) {
          const peopleCards = this.primaryCards.filter(card => people.includes(card));
          const weaponCards = this.primaryCards.filter(card => weapons.includes(card));
          const roomCards = this.primaryCards.filter(card => rooms.includes(card));
          player = Object.assign(player,
            { people: peopleCards, weapons: weaponCards, rooms: roomCards });
        }

        return player;
      }),
    };
    const { history } = this.props;
    gameStore.startGame(game).then(() => history.push('/play'));
  };

  render() {
    const stepsElements = this.steps.map((step, idx) => (
      <Step key={idx} active={step.active} completed={step.completed} title={step.title} />
    ));
    const activeStep = this.steps.find(step => step.active);
    const activeIndex = this.steps.indexOf(activeStep);
    return (
      <div>
        <Step.Group ordered>
          {stepsElements}
        </Step.Group>
        {activeIndex === 1 && this.steps[0].component()}
        {activeStep.component()}
        <Segment basic>
        {activeIndex > 1 &&
          <Button
            disabled={activeIndex === 0}
            onClick={() => this.previousStep(activeIndex)}
            secondary
          >
            Previous
          </Button>
        }
          {activeStep.title === 'Select your cards' ?
            <Button disabled={!activeStep.completed}
              onClick={this.startGame}
              positive>Start!</Button>
            :
            <Button disabled={!activeStep.completed}
              onClick={() => this.nextStep(activeIndex)}
              primary>Next</Button>
          }
          </Segment>
        </div>
    );
  }
}

