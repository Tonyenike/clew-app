import { computed, observable } from 'mobx';

export default class GameStore {
  @observable games = [];
  @observable currentGameId;

  constructor() {
    this.getGames();
  }

  @computed get currentGame() {
    let game;
    if (this.currentGameId) {
      game = this.getGame(this.currentGameId);
    }
    return game;
  }

  getGames() {
    return fetch('http://localhost:5000/api/v1/games')
      .then(res => {
        if (res.ok) {
          return res.json();
        }
      })
      .then(json => this.games = json.data)
      .catch(err => console.log(err));
  }

  getGame(id) {
    return fetch(`http://localhost:5000/api/v1/games/${id}`)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
      })
      .then(json => this.games = json.data)
      .catch(err => console.log(err));
  }

  createGame(game) {
    return fetch('http://localhost:5000/api/v1/games', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(game),
      })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
      })
      .then(json => json.data)
      .catch(err => console.log(err));
  }

  startGame(game) {
    return this.createGame(game).then(newGame => {
      this.currentGameId = newGame._id.$oid;
    });
  }
}
