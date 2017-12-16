import GameStore from './GameStore.js';
import CardStore from './CardStore.js';

export default class RootStore {
  gameStore = new GameStore();
  cardStore = new CardStore();
}
