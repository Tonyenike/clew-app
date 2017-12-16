import { observable } from 'mobx';

export default class Player {
  @observable name;
  @observable card_count;
  @observable people = [];
  @observable weapons = [];
  @observable rooms = [];

  constructor(name, card_count) {
    this.name = name;
    this.card_count = card_count || 3;
  }
}
