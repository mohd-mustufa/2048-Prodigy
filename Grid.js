const GRID_SIZE = 4;
const CELL_SIZE = 20;
const CELL_GAP = 2;

export default class Grid {
	#cells;

	constructor(gridElement) {
		gridElement.style.setProperty("--grid-size", GRID_SIZE);
		gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`);
		gridElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`);

		this.#cells = createCellElements(gridElement).map((cellElement, index) => {
			return new Cell(
				cellElement,
				index % GRID_SIZE,
				Math.floor(index / GRID_SIZE)
			);
		});
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
	#mergeCell;

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

	get mergeCell() {
		return this.#mergeCell;
	}

	set mergeCell(value) {
		this.#mergeCell = value;
		if (value == null) return;
		this.#mergeCell.x = this.#x;
		this.#mergeCell.y = this.#y;
	}

	canAccept(cell) {
		return (
			this.tile == null ||
			(this.#mergeCell == null && this.tile.value == cell.tile.value)
		);
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
