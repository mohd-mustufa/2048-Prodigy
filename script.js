import Grid from "./Grid.js";
import Tile from "./Tile.js";

const gameBoard = document.getElementById("game-board");
const newGame = document.getElementById("new-game");

let grid;
function startNewGame() {
	// Setting the score
	const currentScore = document.getElementById("score");
	const bestScore = document.getElementById("best");
	const allTimeBest = localStorage.getItem("2048-whiz-highscore") || 0;
	currentScore.innerText = "0";
	bestScore.innerText = allTimeBest;

	// Clearing the board and creating new board
	gameBoard.innerHTML = "";
	grid = new Grid(gameBoard);
	grid.randomEmptyCell().tile = new Tile(gameBoard);
	grid.randomEmptyCell().tile = new Tile(gameBoard);

	// Adding the game-over div
	const gameOverDiv = document.createElement("div");
	gameOverDiv.className = "game-over";
	gameOverDiv.id = "game-over";

	const gameOverTextDiv = document.createElement("div");
	gameOverTextDiv.className = "game-over-text";
	gameOverTextDiv.textContent = "Game Over";
	gameOverDiv.appendChild(gameOverTextDiv);

	const playAgainButton = document.createElement("button");
	playAgainButton.id = "restart";
	playAgainButton.textContent = "Play Again";
	playAgainButton.addEventListener("click", () => startNewGame());
	gameOverDiv.appendChild(playAgainButton);

	gameBoard.appendChild(gameOverDiv);
	setUpInput();
}

newGame.addEventListener("click", () => startNewGame());
startNewGame();

function setUpInput() {
	document.addEventListener("keydown", handleInput, { once: true });
}

async function handleInput(e) {
	switch (e.key) {
		case "ArrowUp":
			if (!canMoveUp()) {
				setUpInput();
				return;
			}
			await moveUp();
			break;
		case "ArrowDown":
			if (!canMoveDown()) {
				setUpInput();
				return;
			}
			await moveDown();
			break;
		case "ArrowLeft":
			if (!canMoveLeft()) {
				setUpInput();
				return;
			}
			await moveLeft();
			break;
		case "ArrowRight":
			if (!canMoveRight()) {
				setUpInput();
				return;
			}
			await moveRight();
			break;
		default:
			setUpInput();
			return;
	}
	grid.cells.forEach((cell) => cell.mergeTiles());

	const newTile = new Tile(gameBoard);
	grid.randomEmptyCell().tile = newTile;

	if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
		const gameOver = document.getElementById("game-over");
		newTile.awaitForTransition(true).then(() => {
			gameOver.classList.add("show");
		});
		return;
	}

	setUpInput();
}

function moveUp() {
	return slideTiles(grid.cellsByColumn);
}

function moveDown() {
	return slideTiles(grid.cellsByColumn.map((col) => [...col].reverse()));
}

function moveLeft() {
	return slideTiles(grid.cellsByRow);
}

function moveRight() {
	return slideTiles(grid.cellsByRow.map((row) => [...row].reverse()));
}

function slideTiles(cells) {
	return Promise.all(
		cells.flatMap((group) => {
			let promises = [];
			for (let i = 1; i < group.length; i++) {
				const cell = group[i];
				if (!cell.tile) continue;

				let lastValidCell;
				for (let j = i - 1; j >= 0; j--) {
					const moveToCell = group[j];
					if (!moveToCell.canAccept(cell)) break;
					lastValidCell = moveToCell;
				}

				if (lastValidCell != null) {
					promises.push(cell.tile.awaitForTransition());
					if (lastValidCell.tile != null) {
						lastValidCell.mergeTile = cell.tile;
					} else {
						lastValidCell.tile = cell.tile;
					}
					cell.tile = null;
				}
			}
			return promises;
		})
	);
}

function canMoveUp() {
	return canMove(grid.cellsByColumn);
}

function canMoveDown() {
	return canMove(grid.cellsByColumn.map((column) => [...column].reverse()));
}

function canMoveLeft() {
	return canMove(grid.cellsByRow);
}

function canMoveRight() {
	return canMove(grid.cellsByRow.map((row) => [...row].reverse()));
}

function canMove(cells) {
	return cells.some((group) => {
		return group.some((cell, index) => {
			if (index === 0) return false;
			if (!cell.tile) return false;
			const moveToCell = group[index - 1];
			return moveToCell.canAccept(cell);
		});
	});
}
