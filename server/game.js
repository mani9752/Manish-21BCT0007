class Game {
  constructor() {
    this.board = Array(25).fill(null);
    this.players = [
      { id: 1, team: "red", characters: [1, 2, 3, 4, 5] },
      { id: 2, team: "blue", characters: [6, 7, 8, 9, 10] },
    ];
    this.currentPlayer = 1;
    this.winner = null;
  }

  validateMove(position, player) {
    if (this.board[position] === null) {
      this.board[position] = player;
      this.switchPlayer();
      this.checkWinner();
      return true;
    }
    return false;
  }

  switchPlayer() {
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
  }

  checkWinner() {
    const directions = [
      [1, 0], // Horizontal
      [0, 1], // Vertical
      [1, 1], // Diagonal (bottom-right)
      [1, -1] // Diagonal (bottom-left)
    ];

    const inBounds = (x, y) => x >= 0 && x < 5 && y >= 0 && y < 5;

    const checkDirection = (x, y, dx, dy, player) => {
      let count = 0;
      for (let i = 0; i < 5; i++) {
        const nx = x + i * dx;
        const ny = y + i * dy;
        if (inBounds(nx, ny) && this.board[nx + ny * 5] === player) {
          count++;
        } else {
          break;
        }
      }
      return count === 5;
    };

    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 5; y++) {
        const player = this.board[x + y * 5];
        if (player) {
          for (const [dx, dy] of directions) {
            if (checkDirection(x, y, dx, dy, player)) {
              this.winner = player;
              return;
            }
          }
        }
      }
    }
  }

  getGameState() {
    return {
      board: this.board,
      players: this.players,
      currentPlayer: this.currentPlayer,
      winner: this.winner,
    };
  }
}

module.exports = Game;

