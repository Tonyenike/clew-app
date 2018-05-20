import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Form, Input, Segment } from 'semantic-ui-react';

@observer
export default class PlayerDetails extends Component {

  componentWillMount() {
    const { players, playerCardCounts, validCardCounts } = this.props;
    const valid = validCardCounts.get(players.length);
    players.forEach((player, index) => playerCardCounts.set(player, valid[index]));
  }

  render() {
    const { players, playerCardCounts, playerNames, onCountChange, onNameChange } = this.props;
    const fields = players.map(player => {
      return (
        <Segment key={player}>
          <h4>{player}</h4>
          <Form.Group>
            <Form.Field inline>
              <label>Card Count</label>
              <Input
                type="number"
                min={3}
                max={6}
                value={playerCardCounts.get(player)}
                onChange={(event) => onCountChange(player, +event.target.value)} />
            </Form.Field>
            <Form.Field inline>
              <label>Player Name</label>
              <Input
                value={playerNames.get(player) || ''}
                onChange={event => onNameChange(player, event.target.value)} />
            </Form.Field>
          </Form.Group>
        </Segment>
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
