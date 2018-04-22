import { observable } from 'mobx';
import { API_ROOT } from '../config';
import { toCamelCase } from './JsonUtils';

export default class CardStore {
  @observable people = [];
  @observable weapons = [];
  @observable rooms = [];
  @observable isFetching;

  constructor() {
    this.getPeople();
    this.getWeapons();
    this.getRooms();
  }

  getPeople() {
    this.isFetching = true;
    fetch(`${API_ROOT}/people`)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
      })
      .then(json => this.people = json.data)
      .then(toCamelCase)
      .catch(err => console.log(err))
      .finally(() => this.isFetching = false);
  }

  getWeapons() {
    this.isFetching = true;
    fetch(`${API_ROOT}/weapons`)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
      })
      .then(json => this.weapons = json.data)
      .then(toCamelCase)
      .catch(err => console.log(err))
      .finally(() => this.isFetching = false);
  }

  getRooms() {
    this.isFetching = true;
    fetch(`${API_ROOT}/rooms`)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
      })
      .then(json => this.rooms = json.data)
      .then(toCamelCase)
      .catch(err => console.log(err))
      .finally(() => this.isFetching = false);
  }
}
