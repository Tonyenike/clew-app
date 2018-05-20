import React, { Component } from 'react';
import { computed, observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Form, Radio, Segment, Select } from 'semantic-ui-react';

@observer
export default class PlayTurn extends Component {
  @observable turnType = 'suggestion';

  initialCards = {
    person: '',
    weapon: '',
    room: '',
  };
  @observable cards = Object.assign({}, this.initialCards);

  initialSuggestion = {
    suggester: '',
    wasCardShown: false,
    answerer: undefined,
    cardShown: undefined,
  };
  @observable suggestion = Object.assign({}, this.initialSuggestion);

  initialAccusation = {
    accuser: '',
    isCorrect: false,
  };
  @observable accusation = Object.assign({}, this.initialAccusation);

  @computed get cardsArr() {
    const { person, weapon, room } = this.cards;
    return [person, weapon, room];
  }

  clearFields() {
    this.cards = Object.assign({}, this.initialCards);
    this.suggestion = Object.assign({}, this.initialSuggestion);
    this.accusation = Object.assign({}, this.initialAccusation);
  }

  toggleTurnType = (e, { value }) => this.turnType = value;
  setSuggester = (e, { value }) => this.suggestion.suggester = value;
  setAccuser = (e, { value }) => this.accusation.accuser = value;
  setPerson = (e, { value }) => this.cards.person = value;
  setWeapon = (e, { value }) => this.cards.weapon = value;
  setRoom = (e, { value }) => this.cards.room = value;
  toggleWasCardShown = () => this.suggestion.wasCardShown = !this.suggestion.wasCardShown;
  toggleAccusationCorrect = () => this.accusation.isCorrect = !this.accusation.isCorrect;
  setAnswerer = (e, { value }) => this.suggestion.answerer = value;
  setCardShown = (e, { value }) => this.suggestion.cardShown = value;
  submit = () => {
    const { store: { gameStore } } = this.props;
    if (this.turnType === 'suggestion') {
      let suggestionWithCards = Object.assign(toJS(this.suggestion), toJS(this.cards));
      delete suggestionWithCards.wasCardShown;
      gameStore.addSuggestion(suggestionWithCards)
        .then(() => {
          toast.success('Suggestion submitted')
          this.clearFields();
        });
    } else {
      let accusationWithCards = Object.assign(toJS(this.accusation), toJS(this.cards));
      gameStore.addAccusation(accusationWithCards)
        .then(() => {
          toast.success('Accusation submitted')
          this.clearFields();
        });
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
      const playersOptions = currentGame.players.map(player => ({ value: player.name, text: `${player.userName} (${player.name})` }));
      const cardsOptions = this.cardsArr
        .filter(card => {
          const primary = currentGame.players
            .find(player => player.name === currentGame.primaryPlayer);
          const primaryCards = [...primary.people, ...primary.weapons, ...primary.rooms];
          if (this.suggestion.answerer === currentGame.primaryPlayer) {
            return primaryCards.includes(card);
          } else {
            return !primaryCards.includes(card);
          }
        })
        .map(card => ({ value: card, text: card }));
      const suggestionFields = [
        <Form.Field key="wasCardShown">
          <Radio toggle
            label="Card Shown"
            checked={this.suggestion.wasCardShown}
            onChange={this.toggleWasCardShown}
          />
        </Form.Field>,
        this.suggestion.wasCardShown &&
        <Form.Field key="answerer">
          <label>Answerer</label>
          <Select
            placeholder="Answerer"
            value={this.suggestion.answerer}
            onChange={this.setAnswerer}
            options={playersOptions.filter(option =>
              option.value !== this.suggestion.suggester)}
          />
        </Form.Field>,
        this.suggestion.wasCardShown &&
        (this.suggestion.answerer === currentGame.primaryPlayer ||
          this.suggestion.suggester === currentGame.primaryPlayer) &&
        this.cards.person &&
        this.cards.weapon &&
        this.cards.room &&
        <Form.Field key="cardShown">
          <label>Card shown</label>
          <Select
            placeholder="Card Shown"
            value={this.suggestion.cardShown}
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
                label="Suggestion"
                name="choiceGroup"
                value="suggestion"
                checked={this.turnType === 'suggestion'}
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
              <label>{this.turnType === 'suggestion' ? 'Suggester' : 'Accuser'}</label>
              <Select
                placeholder={this.turnType === 'suggestion' ? 'Suggester' : 'Accuser'}
                value={this.turnType === 'suggestion' ? this.suggestion.suggester : this.accusation.accuser}
                onChange={this.turnType === 'suggestion' ? this.setSuggester : this.setAccuser}
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
            {this.turnType === 'suggestion' && suggestionFields}
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
