import { observable } from 'mobx';

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
    fetch('http://localhost:5000/api/v1/people')
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((json) => this.people = json.data)
      .catch((err) => console.log(err));
  }

  getWeapons() {
    fetch('http://localhost:5000/api/v1/weapons')
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((json) => this.weapons = json.data)
      .catch((err) => console.log(err));
  }

  getRooms() {
    fetch('http://localhost:5000/api/v1/rooms')
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((json) => this.rooms = json.data)
      .catch((err) => console.log(err));
  }
}
