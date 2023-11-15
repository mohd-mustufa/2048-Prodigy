const GRID_SIZE = 4;
const CELL_SIZE = 60;
const CELL_GAP = 2;

export default class Grid {
	#cells;

	constructor(gridElement) {
		gridElement.style.setProperty("--grid-size", GRID_SIZE);
		gridElement.style.setProperty("--cell-size", `${CELL_SIZE}px`);
		gridElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`);

		this.#cells = createCellElements(gridElement).map((cellElement, index) => {
			return new Cell(
				cellElement,
				index % GRID_SIZE,
				Math.floor(index / GRID_SIZE)
			);
		});
	}

	get cells() {
		return this.#cells;
	}

	get cellsByRow() {
		return this.#cells.reduce((cellGrid, cell) => {
			cellGrid[cell.y] = cellGrid[cell.y] || [];
			cellGrid[cell.y][cell.x] = cell;
			return cellGrid;
		}, []);
	}

	get cellsByColumn() {
		return this.#cells.reduce((cellGrid, cell) => {
			cellGrid[cell.x] = cellGrid[cell.x] || [];
			cellGrid[cell.x][cell.y] = cell;
			return cellGrid;
		}, []);
	}

	get #emptyCells() {
		return this.#cells.filter((cell) => cell.tile == null);
	}

	randomEmptyCell() {
		const randomIndex = Math.floor(Math.random() * this.#emptyCells.length);
		return this.#emptyCells[randomIndex];
	}
}

class Cell {
	#cell;
	#x;
	#y;
	#tile;
	#mergeTile;

	constructor(cellElement, x, y) {
		this.#cell = cellElement;
		this.#x = x;
		this.#y = y;
	}

	get x() {
		return this.#x;
	}

	get y() {
		return this.#y;
	}

	get tile() {
		return this.#tile;
	}

	set tile(value) {
		this.#tile = value;
		if (value == null) return;
		this.#tile.x = this.#x;
		this.#tile.y = this.#y;
	}

	get mergeTile() {
		return this.#mergeTile;
	}

	set mergeTile(value) {
		this.#mergeTile = value;
		if (value == null) return;
		this.#mergeTile.x = this.#x;
		this.#mergeTile.y = this.#y;
	}

	canAccept(cell) {
		return (
			this.tile == null ||
			(this.#mergeTile == null && this.tile.value == cell.tile.value)
		);
	}

	mergeTiles() {
		if (!this.#tile || !this.#mergeTile) return;
		this.#tile.value = this.#tile.value + this.#mergeTile.value;
		this.#populateScores();
		this.#mergeTile.remove();
		this.#mergeTile = null;
	}

	#populateScores() {
		const currentScoreContainer = document.getElementById("score");
		const bestScoreContainer = document.getElementById("best");
		const currentScore =
			parseInt(currentScoreContainer.innerText) + parseInt(this.#tile.value);
		const bestScore = localStorage.getItem("2048-whiz-highscore") || 0;

		currentScoreContainer.innerText = currentScore;
		if (currentScore > bestScore) {
			localStorage.setItem("2048-whiz-highscore", currentScore);
			bestScoreContainer.innerText = currentScore;
		}
	}
}

const createCellElements = (gridElement) => {
	const cells = [];
	for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
		const cell = document.createElement("div");
		cell.classList.add("cell");
		gridElement.append(cell);
		cells.push(cell);
	}
	return cells;
};
