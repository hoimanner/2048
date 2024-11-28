const gridContainer = document.getElementById("grid-container");
const restartButton = document.getElementById("restart-button");
const scoreDisplay = document.getElementById("score");

let grid = [];
let score = 0;

function initializeGrid() {
    grid = Array.from({ length: 4 }, () => Array(4).fill(0));
    score = 0;
    updateScore();
    addRandomTile();
    addRandomTile();
    renderGrid();
}

function addRandomTile() {
    const emptyTiles = [];
    grid.forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
            if (value === 0) {
                emptyTiles.push({ row: rowIndex, col: colIndex });
            }
        });
    });
    
    if (emptyTiles.length) {
        const { row, col } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        grid[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
}

function renderGrid() {
    gridContainer.innerHTML = '';
    grid.forEach((row) => {
        row.forEach((value) => {
            const cell = document.createElement("div");
            cell.classList.add("cell", `cell-${value || 0}`);
            cell.textContent = value || '';
            gridContainer.appendChild(cell);
        });
    });
}

function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

function slide(row) {
    row = row.filter(val => val);
    while (row.length < 4) {
        row.push(0);
    }
    return row;
}

function combine(row) {
    for (let i = 0; i < 3; i++) {
        if (row[i] && row[i] === row[i + 1]) {
            row[i] *= 2;
            score += row[i];
            row[i + 1] = 0;
        }
    }
    return slide(row);
}

function move(direction) {
    let moved = false;

    for (let i = 0; i < 4; i++) {
        let row = direction === 'left' || direction === 'right' ? grid[i] : grid.map(r => r[i]);
        if (direction === 'right' || direction === 'down') {
            row = row.reverse();
        }

        const originalRow = [...row];
        row = slide(combine(slide(row)));

        if (direction === 'right' || direction === 'down') {
            row = row.reverse();
        }

        if (originalRow.join(',') !== row.join(',')) {
            moved = true;
        }

        if (direction === 'left' || direction === 'right') {
            grid[i] = row;
        } else {
            for (let j = 0; j < 4; j++) {
                grid[j][i] = row[j];
            }
        }
    }

    if (moved) {
        addRandomTile();
        renderGrid();
        updateScore();
    }
}

function checkGameOver() {
    // Check for any available moves
    for (const row of grid) {
        for (let i = 0; i < row.length - 1; i++) {
            if (row[i] === 0 || row[i] === row[i + 1]) return false;
        }
    }
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[j][i] === 0 || grid[j][i] === grid[j + 1][i]) return false;
        }
    }
    alert("Game Over!");
    return true;
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        move('left');
    } else if (event.key === "ArrowRight") {
        move('right');
    } else if (event.key === "ArrowUp") {
        move('up');
    } else if (event.key === "ArrowDown") {
        move('down');
    }
    checkGameOver();
});

restartButton.addEventListener("click", initializeGrid);

initializeGrid();