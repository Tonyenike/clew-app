import React, { Component } from 'react';
import { computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Form, Radio, Segment, Select } from 'semantic-ui-react';

@observer
export default class PlayGame extends Component {
  @observable turnType = 'guess';
  @observable cards = {
    person: '',
    weapon: '',
    room: '',
  };
  @observable accusationCorrect = false;
  @observable currentGame;

  @observable guess = {
    guesser: '',
    ...this.cards,
    was_card_shown: false,
    answerer: '',
    card_shown: '',
  }

  @observable accusation = {
    accuser: '',
    ...this.cards,
    is_correct: false,
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
  toggleWasCardShown = () => this.guess.was_card_shown = !this.guess.was_card_shown;
  toggleAccusationCorrect = () => this.accusation.is_correct = !this.accusation.is_correct;
  setAnswerer = (e, { value }) => this.guess.answerer = value;
  setCardShown = (e, { value }) => this.guess.card_shown = value;

  componentWillMount() {
    const { store: { gameStore: { currentGame } } } = this.props;
    if (currentGame) {
      currentGame.then(game => {
        this.currentGame = game;
      });
    }
  }

  render() {
    if (this.currentGame) {
      const players = this.currentGame.players.map(player => player.name);
      const playersOptions = players.map(player => ({ value: player, text: player }));
      const { store: { cardStore: { people, weapons, rooms, } } } = this.props;
      const cardsOptions = this.cardsArr
        .filter(card => {
          const primary = this.currentGame.players
            .find(player => player.name === this.currentGame.primary_player);
          const primaryCards = [...primary.people, ...primary.weapons, ...primary.rooms];
          return !primaryCards.includes(card);
        })
        .map(card => ({ value: card, text: card }));
      const guessFields = (
        <div>
          <Form.Field>
            <Radio toggle
              label="Card Shown"
              checked={this.guess.was_card_shown}
              onChange={this.toggleWasCardShown}
            />
          </Form.Field>
          {
            this.guess.was_card_shown &&
            <Form.Field>
              <label>Answerer</label>
              <Select
                placeholder="Answerer"
                value={this.guess.answerer}
                onChange={this.setAnswerer}
                options={playersOptions.filter(option =>
                  option.value !== this.guess.guesser)}
              />
            </Form.Field>
          }
          {
            this.guess.was_card_shown &&
            this.guess.answerer === this.currentGame.primary_player &&
            this.cards.person &&
            this.cards.weapon &&
            this.cards.room &&
            <Form.Field>
              <label>Card shown</label>
              <Select
                placeholder="Card shown"
                value={this.guess.card_shown}
                onChange={this.setCardShown}
                options={cardsOptions}
              />
            </Form.Field>
          }
        </div>
      );
      const accusationFields = (
        <Form.Field>
          <Radio toggle
            label="Accusation Correct"
            checked={this.accusation.is_correct}
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
          </Form>
        </Segment>
      );
    } else {
      return <p>Please start a <Link to="/new-game">new game</Link></p>;
    }
  }
}
