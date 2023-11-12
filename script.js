import Grid from "./Grid.js";
import Tile from "./Tile.js";

const gameBoard = document.getElementById("game-board");
const grid = new Grid(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
setUpInput();

function setUpInput() {
	document.addEventListener("keydown", handleInput, { once: true });
}

async function handleInput(e) {
	switch (e.key) {
		case "ArrowUp":
			await moveUp();
			break;
		case "ArrowDown":
			await moveDown();
			break;
		case "ArrowLeft":
			await moveLeft();
			break;
		case "ArrowRight":
			await moveRight();
			break;
		default:
			setUpInput();
			return;
	}
	setUpInput();
	grid.cells.forEach((cell) => cell.mergeTiles());
	const newTile = new Tile(gameBoard);
	grid.randomEmptyCell().tile = newTile;
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
