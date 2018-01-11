import React, { Component } from 'react';
import { computed, observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Button, Form, Radio, Segment, Select } from 'semantic-ui-react';

@observer
export default class PlayTurn extends Component {
  @observable turnType = 'guess';
  @observable cards = {
    person: '',
    weapon: '',
    room: '',
  };

  @observable guess = {
    guesser: '',
    wasCardShown: false,
    answerer: undefined,
    cardShown: undefined,
  }

  @observable accusation = {
    accuser: '',
    isCorrect: false,
  }

  @computed get cardsArr() {
    const { person, weapon, room } = this.cards;
    return [person, weapon, room];
  }

  toggleTurnType = (e, { value }) => this.turnType = value;
  setGuesser = (e, { value }) => this.guess.guesser = value;
  setAccuser = (e, { value }) => this.accusation.accuser = value;
  setPerson = (e, { value }) => this.cards.person = value;
  setWeapon = (e, { value }) => this.cards.weapon = value;
  setRoom = (e, { value }) => this.cards.room = value;
  toggleWasCardShown = () => this.guess.wasCardShown = !this.guess.wasCardShown;
  toggleAccusationCorrect = () => this.accusation.isCorrect = !this.accusation.isCorrect;
  setAnswerer = (e, { value }) => this.guess.answerer = value;
  setCardShown = (e, { value }) => this.guess.cardShown = value;
  submit = () => {
    const { store: { gameStore } } = this.props;
    if (this.turnType === 'guess') {
      let guessWithCards = Object.assign(toJS(this.guess), toJS(this.cards));
      gameStore.addGuess(guessWithCards);
    } else {
      let accusationWithCards = Object.assign(toJS(this.accusation), toJS(this.cards));
      gameStore.addAccusation(accusationWithCards);
    }
  };

  render() {
    const {
      store: {
        cardStore: {
          people,
          weapons,
          rooms,
        },
        gameStore: {
          currentGame
        }
      }
    } = this.props;
    if (currentGame) {
      const players = currentGame.players.map(player => player.name);
      const playersOptions = players.map(player => ({ value: player, text: player }));
      const cardsOptions = this.cardsArr
        .filter(card => {
          const primary = currentGame.players
            .find(player => player.name === currentGame.primaryPlayer);
          const primaryCards = [...primary.people, ...primary.weapons, ...primary.rooms];
          return primaryCards.includes(card);
        })
        .map(card => ({ value: card, text: card }));
      const guessFields = [
        <Form.Field key="wasCardShown">
          <Radio toggle
            label="Card Shown"
            checked={this.guess.wasCardShown}
            onChange={this.toggleWasCardShown}
          />
        </Form.Field>,
        this.guess.wasCardShown &&
        <Form.Field key="answerer">
          <label>Answerer</label>
          <Select
            placeholder="Answerer"
            value={this.guess.answerer}
            onChange={this.setAnswerer}
            options={playersOptions.filter(option =>
              option.value !== this.guess.guesser)}
          />
        </Form.Field>,
        this.guess.wasCardShown &&
        this.guess.answerer === currentGame.primaryPlayer &&
        this.cards.person &&
        this.cards.weapon &&
        this.cards.room &&
        <Form.Field key="cardShown">
          <label>Card shown</label>
          <Select
            placeholder="Card Shown"
            value={this.guess.cardShown}
            onChange={this.setCardShown}
            options={cardsOptions}
          />
        </Form.Field>
      ];
      const accusationFields = (
        <Form.Field>
          <Radio toggle
            label="Accusation Correct"
            checked={this.accusation.isCorrect}
            onChange={this.toggleAccusationCorrect}
          />
        </Form.Field>
      );
      return (
        <Segment basic>
          <Form>
            <Form.Field>
              <Radio
                label="Guess"
                name="choiceGroup"
                value="guess"
                checked={this.turnType === 'guess'}
                onChange={this.toggleTurnType}
              />
            </Form.Field>
            <Form.Field>
              <Radio
                label="Accusation"
                name="choiceGroup"
                value="accusation"
                checked={this.turnType === 'accusation'}
                onChange={this.toggleTurnType}
              />
            </Form.Field>
            <Form.Field>
              <label>{this.turnType === 'guess' ? 'Guesser' : 'Accuser'}</label>
              <Select
                placeholder={this.turnType === 'guess' ? 'Guesser' : 'Accuser'}
                value={this.turnType === 'guess' ? this.guess.guesser : this.accusation.accuser}
                onChange={this.turnType === 'guess' ? this.setGuesser : this.setAccuser}
                options={playersOptions}
              />
            </Form.Field>
            <Form.Field>
              <label>Person</label>
              <Select
                placeholder="Person"
                value={this.cards.person}
                onChange={this.setPerson}
                options={people.map(person => ({ value: person, text: person }))}
              />
            </Form.Field>
            <Form.Field>
              <label>Weapon</label>
              <Select
                placeholder="Weapon"
                value={this.cards.weapon}
                onChange={this.setWeapon}
                options={weapons.map(weapon => ({ value: weapon, text: weapon }))}
              />
            </Form.Field>
            <Form.Field>
              <label>Room</label>
              <Select
                placeholder="Room"
                value={this.cards.room}
                onChange={this.setRoom}
                options={rooms.map(room => ({ value: room, text: room }))}
              />
            </Form.Field>
            {this.turnType === 'guess' && guessFields}
            {this.turnType === 'accusation' && accusationFields}
            <Button onClick={this.submit} primary>Submit</Button>
          </Form>
        </Segment>
      );
    } else {
      return <p>Please start a <Link to="/new-game">new game</Link></p>;
    }
  }
}
