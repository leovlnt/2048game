class Game2048 {
    constructor() {
        this.board = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.gameBoard = document.getElementById('game-board');
        this.scoreDisplay = document.getElementById('score');
        this.setupEventListeners();
        this.initializeGame();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp': this.move('up'); break;
                case 'ArrowDown': this.move('down'); break;
                case 'ArrowLeft': this.move('left'); break;
                case 'ArrowRight': this.move('right'); break;
            }
        });

        document.getElementById('new-game').addEventListener('click', () => this.resetGame());
    }

    initializeGame() {
        this.addRandomTile();
        this.addRandomTile();
        this.renderBoard();
    }

    resetGame() {
        this.board = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.scoreDisplay.textContent = '0';
        this.initializeGame();
    }

    addRandomTile() {
        const emptyCells = [];
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (this.board[r][c] === 0) {
                    emptyCells.push({r, c});
                }
            }
        }

        if (emptyCells.length > 0) {
            const {r, c} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    move(direction) {
        const previousBoard = JSON.stringify(this.board);
        const rotatedBoard = this.rotateBoard(direction);
        let moved = false;

        for (let r = 0; r < 4; r++) {
            const row = rotatedBoard[r].filter(cell => cell !== 0);
            
            for (let c = 0; c < row.length - 1; c++) {
                if (row[c] === row[c + 1]) {
                    row[c] *= 2;
                    this.score += row[c];
                    row.splice(c + 1, 1);
                    moved = true;
                }
            }

            while (row.length < 4) {
                row.push(0);
            }

            rotatedBoard[r] = row;
        }

        this.board = this.unrotateBoard(rotatedBoard, direction);
        
        // Only add new tile and update if the board actually changed
        if (JSON.stringify(this.board) !== previousBoard) {
            this.addRandomTile();
            this.renderBoard();
            this.scoreDisplay.textContent = this.score;
        }
    }

    rotateBoard(direction) {
        switch(direction) {
            case 'up': return this.transposeBoard(this.board);
            case 'down': return this.transposeBoard(this.board).map(row => row.reverse());
            case 'left': return this.board;
            case 'right': return this.board.map(row => row.reverse());
        }
    }

    unrotateBoard(board, direction) {
        switch(direction) {
            case 'up': return this.transposeBoard(board);
            case 'down': return this.transposeBoard(board.map(row => row.reverse()));
            case 'left': return board;
            case 'right': return board.map(row => row.reverse());
        }
    }

    transposeBoard(board) {
        return board[0].map((_, colIndex) => board.map(row => row[colIndex]));
    }

    renderBoard() {
        this.gameBoard.innerHTML = '';
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                const tile = document.createElement('div');
                tile.classList.add('tile');
                
                if (this.board[r][c] !== 0) {
                    tile.textContent = this.board[r][c];
                    tile.classList.add(`tile-${this.board[r][c]}`);
                }
                
                this.gameBoard.appendChild(tile);
            }
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Game2048();
});
