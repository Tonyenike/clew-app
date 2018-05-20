import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Feed } from 'semantic-ui-react';

@observer
export default class TurnLog extends Component {

  turnToText(turn) {
    const { store: { gameStore: { currentGame: { players } } } } = this.props;
    let text;
    if (turn.hasOwnProperty('suggester')) {
      const suggester = players.find(player => player.name === turn.suggester);
      text = `${suggester.userName} (${turn.suggester}) suggested [${turn.person}, ${turn.weapon}, ${turn.room}].`;
      if (turn.answerer) {
        const answerer = players.find(player => player.name === turn.answerer);
        text += ` Refuted by ${answerer.userName} (${turn.answerer})`;
        if (turn.cardShown) {
          text += ` using ${turn.cardShown}.`;
        } else {
          text += '.';
        }
      }
    } else {
      const accuser = players.find(player => player.name === turn.accuser);
      text = `${accuser.userName} (${turn.accuser}) accused [${turn.person}, ${turn.weapon}, ${turn.room}].`;
      if (turn.isCorrect) {
        text += ' Accusation was correct.';
      } else {
        text += ' Accusation was not correct.';
      }
    }
    return text;
  }

  render() {
    const {
      store: {
        gameStore: {
          currentGame
        }
      }
    } = this.props;
    if (currentGame) {
      const turns = currentGame.suggestions
        .concat(currentGame.accusations)
        .sort((a, b) => {
          return a.insertDate - b.insertDate;
        });
      return (
        <Feed>
          {turns.map((turn, index) => (
            <Feed.Event key={index}>
              <Feed.Content>
                <Feed.Summary>
                  {this.turnToText(turn)}
                </Feed.Summary>
              </Feed.Content>
            </Feed.Event>
          ))}
        </Feed>
      );
    } else {
      return <p>Please start a <Link to="/new-game">new game</Link></p>;
    }
  }
}
