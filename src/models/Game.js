import { observable } from 'mobx';

export default class Game {
  @observable primary_player;
  @observable players;

  constructor(primary_player, players) {
    this.primary_player = primary_player;
    this.players = players;
  }
}
