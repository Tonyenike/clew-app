import { observable } from 'mobx';

export default class GameStore {
  @observable games = [];

  constructor() {
    this.getGames();
  }

  getGames() {
    fetch('http://localhost:5000/api/v1/games')
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((json) => this.games = json.data)
      .catch((err) => console.log(err));
  }
}
