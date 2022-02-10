class GameHistory {
  save(board: any) {
    const day = Math.floor(Number(new Date()) / (1000 * 60 * 60 * 24));
    const savedHistory = localStorage.getItem('game-history');
    const history = savedHistory ? JSON.parse(savedHistory) : {};
    history[day] = board;
    localStorage.setItem('game-history', JSON.stringify(history));
  }
  loadToday() {
    const history = this.loadAll();
    const day = Math.floor(Number(new Date()) / (1000 * 60 * 60 * 24));
    return history[day];
  }
  loadAll() {
    const savedHistory = localStorage.getItem('game-history');
    const history = savedHistory ? JSON.parse(savedHistory) : {};
    return history;
  }
}

const history = new GameHistory();

export { history };