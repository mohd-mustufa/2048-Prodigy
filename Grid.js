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

	constructor(cellElement, x, y) {
		this.#cell = cellElement;
		this.#x = x;
		this.#y = y;
	}

	get tile() {
		return this.#tile;
	}

	set tile(value) {
		this.#tile = value;
		this.#tile.x = this.#x;
		this.#tile.y = this.#y;
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