import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Form, Input, Segment } from 'semantic-ui-react';

@observer
export default class PlayerCardCount extends Component {

  componentWillMount() {
    const { players, playerCardCounts, validCardCounts } = this.props;
    const valid = validCardCounts.get(players.length);
    players.forEach((player, index) => playerCardCounts.set(player, valid[index]));
  }

  render() {
    const { players, playerCardCounts, onCountChange } = this.props;
    const fields = players.map(player => {
      return (
        <Form.Field key={player} inline>
          <label>{player}</label>
          <Input type="number"
            min={3}
            max={6}
            value={playerCardCounts.get(player)}
            onChange={(event) => onCountChange(player, +event.target.value)} />
        </Form.Field>
      )
    });
    return (
      <Segment basic>
        <Form>
          {fields}
        </Form>
      </Segment>
    )
  }
}
