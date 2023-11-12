export default class Tile {
	#tileElement;
	#x;
	#y;
	#value;

	constructor(tileContainer, value = Math.random() >= 0.2 ? 2 : 4) {
		this.#tileElement = document.createElement("div");
		this.#tileElement.classList.add("tile");
		tileContainer.append(this.#tileElement);
		this.value = value;
	}

	get value() {
		return this.#value;
	}

	set value(value) {
		this.#value = value;
		this.#tileElement.innerText = value;
		const power = Math.log2(value);
		const backgroundLightness = 100 - power * 8;
		const textLightness = backgroundLightness <= 50 ? 80 : 20;
		this.#tileElement.style.setProperty(
			"--background-lightness",
			`${backgroundLightness}%`
		);
		this.#tileElement.style.setProperty(
			"--text-lightness",
			`${textLightness}%`
		);
	}

	set x(value) {
		this.#x = value;
		this.#tileElement.style.setProperty("--x", value);
	}

	set y(value) {
		this.#y = value;
		this.#tileElement.style.setProperty("--y", value);
	}

	remove() {
		this.#tileElement.remove();
	}

	awaitForTransition() {
		return new Promise((resolve) => {
			this.#tileElement.addEventListener("transitionend", resolve, {
				once: true,
			});
		});
	}
}
