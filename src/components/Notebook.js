import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Icon, Table } from 'semantic-ui-react';

@observer
export default class Notebook extends Component {

  statusIcons = {
    'true': <Icon name="check" color="green" />,
    'false': <Icon name="cancel" color="red" />,
    'unknown': <p>&nbsp;</p>,
  };

  getStatusIcon(player, card) {
    const { store: { gameStore: { notebook } } } = this.props;
    const hasCard = notebook.find(entry =>
      entry.player === player && entry.card === card).hasCard;
    return this.statusIcons[hasCard];
  }

  render() {
    const {
      store: {
        cardStore: {
          people,
          weapons,
          rooms
        },
        gameStore: {
          currentGame,
          notebook
        }
      }
    } = this.props;
    let playerHeadings;
    let players;
    if (currentGame && notebook) {
      players = currentGame.players.sort((a, b) => a.index - b.index);
      const playerNames = [...players.map(player => player.name), 'Case File'];
      playerHeadings = playerNames.map(name => <Table.HeaderCell key={name}>{name}</Table.HeaderCell>);
      return (
        <Table textAlign="center" celled structured>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell rowSpan="2">Category</Table.HeaderCell>
              <Table.HeaderCell rowSpan="2">Card</Table.HeaderCell>
              <Table.HeaderCell colSpan={playerNames ? playerNames.length : 1}>Players</Table.HeaderCell>
            </Table.Row>
            <Table.Row>
              {playerHeadings}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell rowSpan={people.length}>People</Table.Cell>
              {people.length > 0 && <Table.Cell>{people[0]}</Table.Cell>}
              {playerNames && playerNames.map((player, index) =>
                <Table.Cell key={index}>
                  {this.getStatusIcon(player, people[0])}
                </Table.Cell>)
              }
            </Table.Row>
            {people.slice(1).map(person => (
              <Table.Row key={person}>
                <Table.Cell>{person}</Table.Cell>
                {playerNames && playerNames.map((player, index) =>
                  <Table.Cell key={index}>
                    {this.getStatusIcon(player, person)}
                  </Table.Cell>)
                }
              </Table.Row>
            ))}
            <Table.Row>
              <Table.Cell rowSpan={weapons.length}>Weapons</Table.Cell>
              {weapons.length > 0 && <Table.Cell>{weapons[0]}</Table.Cell>}
              {playerNames && playerNames.map((player, index) =>
                <Table.Cell key={index}>
                  {this.getStatusIcon(player, weapons[0])}
                </Table.Cell>)
              }
            </Table.Row>
            {weapons.slice(1).map(weapon => (
              <Table.Row key={weapon}>
                <Table.Cell>{weapon}</Table.Cell>
                {playerNames && playerNames.map((player, index) =>
                  <Table.Cell key={index}>
                    {this.getStatusIcon(player, weapon)}
                  </Table.Cell>)
                }
              </Table.Row>
            ))}
            <Table.Row>
              <Table.Cell rowSpan={rooms.length}>Rooms</Table.Cell>
              {rooms.length > 0 && <Table.Cell>{rooms[0]}</Table.Cell>}
              {playerNames && playerNames.map((player, index) =>
                <Table.Cell key={index}>
                  {this.getStatusIcon(player, rooms[0])}
                </Table.Cell>)
              }
            </Table.Row>
            {rooms.slice(1).map(room => (
              <Table.Row key={room}>
                <Table.Cell>{room}</Table.Cell>
                {playerNames && playerNames.map((player, index) =>
                  <Table.Cell key={index}>
                    {this.getStatusIcon(player, room)}
                  </Table.Cell>)
                }
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      );
    } else {
      return <p>Please start a <Link to="/new-game">new game</Link></p>;
    }
  }
}
