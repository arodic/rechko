class GameHistory {
  save(board: any, day: number) {
    const savedHistory = localStorage.getItem('game-history');
    const history = savedHistory ? JSON.parse(savedHistory) : {};
    history[day] = board;
    localStorage.setItem('game-history', JSON.stringify(history));
  }
  load(day: number) {
    const history = this.loadAll();
    return history[day];
  }
  loadAll() {
    const savedHistory = localStorage.getItem('game-history');
    const history = savedHistory ? JSON.parse(savedHistory) : {};
    return history;
  }
}

export const history = new GameHistory();