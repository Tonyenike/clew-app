import { observable } from 'mobx';
import { API_ROOT } from '../config';
import { toCamelCase, toSnakeCase } from './JsonUtils';

export default class GameStore {
  @observable games = [];
  @observable currentGameId;
  @observable currentGame;
  @observable notebook;

  constructor() {
    this.getGames();
  }

  getGames() {
    return fetch(`${API_ROOT}/games`)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
      })
      .then(json => this.games = json.data)
      .then(games => games.map(toCamelCase))
      .catch(err => console.log(err));
  }

  getGame(id) {
    return fetch(`${API_ROOT}/games/${id}`)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
      })
      .then(json => this.games = json.data)
      .then(toCamelCase)
      .catch(err => console.log(err));
  }

  getNotebook(id) {
    return fetch(`${API_ROOT}/games/${id}/notebook`)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
      })
      .then(json => json.data)
      .then(toCamelCase)
      .catch(err => console.log(err));
  }

  createGame(game) {
    return fetch(`${API_ROOT}/games`, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(toSnakeCase(game)),
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
      })
      .then(json => json.data)
      .then(toCamelCase)
      .catch(err => console.log(err));
  }

  addGuess(guess) {
    return fetch(`${API_ROOT}/games/${this.currentGameId}/guesses`, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(toSnakeCase(guess)),
    })
      .then(res => {
        if (res.ok) {
          this.getGame(this.currentGameId)
            .then(game => this.currentGame = game);
          this.getNotebook(this.currentGameId)
            .then(notebook => this.notebook = notebook);
          return res.json();
        }
      })
      .then(json => json.data)
      .then(toCamelCase)
      .catch(err => console.log(err));
  }

  addAccusation(accusation) {
    return fetch(`${API_ROOT}/games/${this.currentGameId}/accusations`, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(toSnakeCase(accusation)),
    })
      .then(res => {
        if (res.ok) {
          this.getGame(this.currentGameId)
            .then(game => this.currentGame = game);
          this.getNotebook(this.currentGameId)
            .then(notebook => this.notebook = notebook);
          return res.json();
        }
      })
      .then(json => json.data)
      .then(toCamelCase)
      .catch(err => console.log(err));
  }

  startGame(game) {
    return this.createGame(game).then(newGame => {
      this.currentGameId = newGame.id.oid;
      this.currentGame = newGame;
      this.getNotebook(this.currentGameId)
        .then(notebook => this.notebook = notebook);
    });
  }
}
