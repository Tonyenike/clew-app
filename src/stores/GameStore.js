import { autorun, observable, toJS } from 'mobx';
import { API_ROOT } from '../config';
import { toCamelCase, toSnakeCase } from './JsonUtils';

export default class GameStore {
  @observable games = [];
  @observable currentGameId;
  @observable currentGame;
  @observable notebook;
  @observable isFetching;

  constructor() {
    this.getGames();
    const storedGameId = localStorage.getItem('currentGameId');
    if (storedGameId) {
      this.currentGameId = storedGameId;
      this.getGame(this.currentGameId)
        .then(game => this.currentGame = game);
      this.getNotebook(this.currentGameId)
        .then(notebook => this.notebook = notebook);
    }
  }

  storage = autorun(() => {
    if (this.currentGameId) {
      localStorage.setItem('currentGameId', toJS(this.currentGameId));
    }
  });

  getGames() {
    this.isFetching = true;
    return fetch(`${API_ROOT}/games`)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
      })
      .then(json => this.games = json.data)
      .then(games => games.map(toCamelCase))
      .catch(err => console.log(err))
      .finally(() => this.isFetching = false);
  }

  getGame(id) {
    this.isFetching = true;
    return fetch(`${API_ROOT}/games/${id}`)
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          if (res.status === 404) {
            this.currentGameId = undefined;
            localStorage.removeItem('currentGameId');
            throw Error(res.statusText);
          }
        }
      })
      .then(json => this.games = json.data)
      .then(toCamelCase)
      .catch(err => console.log(err))
      .finally(() => this.isFetching = false);
  }

  getNotebook(id) {
    this.isFetching = true;
    return fetch(`${API_ROOT}/games/${id}/notebook`)
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          if (res.status === 404) {
            throw Error(res.statusText);
          }
        }
      })
      .then(json => json.data)
      .then(toCamelCase)
      .catch(err => console.log(err))
      .finally(() => this.isFetching = false);
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

  addSuggestion(suggestion) {
    return fetch(`${API_ROOT}/games/${this.currentGameId}/suggestions`, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(toSnakeCase(suggestion)),
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
