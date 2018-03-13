import { observable } from 'mobx';
import { API_ROOT } from '../config';
import { toCamelCase } from './JsonUtils';

export default class CardStore {
  @observable people = [];
  @observable weapons = [];
  @observable rooms = [];

  constructor() {
    this.getPeople();
    this.getWeapons();
    this.getRooms();
  }

  getPeople() {
    fetch(`${API_ROOT}/people`)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
      })
      .then(json => this.people = json.data)
      .then(toCamelCase)
      .catch(err => console.log(err));
  }

  getWeapons() {
    fetch(`${API_ROOT}/weapons`)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
      })
      .then(json => this.weapons = json.data)
      .then(toCamelCase)
      .catch(err => console.log(err));
  }

  getRooms() {
    fetch(`${API_ROOT}/rooms`)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
      })
      .then(json => this.rooms = json.data)
      .then(toCamelCase)
      .catch(err => console.log(err));
  }
}
