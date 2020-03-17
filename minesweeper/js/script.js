class Minefield {
	constructor(row, column) {
		this.row = row;
		this.column = column;
		this.field = document.querySelector('td[data-cell-row="' + this.row + '"][data-cell-column="' + this.column + '"]');
		this.field.classList.add('active');
		this.active = 1;
		this.upperRow = this.row - 1;
		this.lowerRow = this.row + 1;
		this.leftColumn = this.column - 1;
		this.rightColumn = this.column + 1;
		this.bomb = 0;
		this.flag = 0;
	}

	setup(firstRow, firstColumn, probability) {
		let firstUpperRow = firstRow - 1;
		let firstLowerRow = firstRow + 1;
		let firstLeftColumn = firstColumn - 1;
		let firstRightColumn = firstColumn + 1;
		if ((this.row == firstUpperRow || this.row == firstRow || this.row == firstLowerRow) && (this.column == firstLeftColumn || this.column == firstColumn || this.column == firstRightColumn)) {
			this.bomb = 0;
			emptyFields++;
		} else {
			let randomNumber = Math.random();
			if (randomNumber < probability) {
				this.bomb = 1;
				bombs++;
			} else {
				this.bomb = 0;
				emptyFields++;
			}
		}
	}

	setFlag() {
		if (this.flag) {
			this.flag = 0;
			this.field.classList.remove('flag');
		} else if (this.active) {
			this.flag = 1;
			this.field.classList.add('flag');
		}
	}

	check() {
		if ( this.active && !this.flag ) {
			this.active = 0;
			this.field.classList.remove('active');
			if (this.bomb) {
				this.field.classList.add('bomb');
				document.getElementById('lose-modal').classList.add('show');
			} else {
				// get number of nearby bombs
				switch (this.checkNearby()) {
					case 0:
						// reveal nearby fields if no bombs are nearby
						this.activateNearby();
						break;
					case 1:
						this.field.classList.add('one');
						break;
					case 2:
						this.field.classList.add('two');
						break;
					case 3:
						this.field.classList.add('three');
						break;
					case 4:
						this.field.classList.add('four');
						break;
					case 5:
						this.field.classList.add('five');
						break;
					case 6:
						this.field.classList.add('six');
						break;
					case 7:
						this.field.classList.add('seven');
						break;
					case 8:
						this.field.classList.add('eight');
						break;
				}
				if (--emptyFields == 0) {
					document.getElementById('win-modal').classList.add('show');
				}
			}
		}
	}

	checkNearby() {
		let nearbyBombs = 0;
		if (fields[this.upperRow]) {
			if (fields[this.upperRow][this.leftColumn]) { nearbyBombs += fields[this.upperRow][this.leftColumn].bomb; }
			nearbyBombs += fields[this.upperRow][this.column].bomb;
			if (fields[this.upperRow][this.rightColumn]) { nearbyBombs += fields[this.upperRow][this.rightColumn].bomb; }
		}
		if (fields[this.row][this.leftColumn]) { nearbyBombs += fields[this.row][this.leftColumn].bomb; }
		if (fields[this.row][this.rightColumn]) { nearbyBombs += fields[this.row][this.rightColumn].bomb; }
		if (fields[this.lowerRow]) {
			if (fields[this.lowerRow][this.leftColumn]) { nearbyBombs += fields[this.lowerRow][this.leftColumn].bomb; }
			nearbyBombs += fields[this.lowerRow][this.column].bomb;
			if (fields[this.lowerRow][this.rightColumn]) { nearbyBombs += fields[this.lowerRow][this.rightColumn].bomb; }
		}
		return nearbyBombs;
	}

	activateNearby() {
		if (fields[this.upperRow]) {
			if (fields[this.upperRow][this.leftColumn]) { fields[this.upperRow][this.leftColumn].check(); }
			fields[this.upperRow][this.column].check();
			if (fields[this.upperRow][this.rightColumn]) { fields[this.upperRow][this.rightColumn].check(); }
		}
		if (fields[this.row][this.leftColumn]) { fields[this.row][this.leftColumn].check(); }
		if (fields[this.row][this.rightColumn]) { fields[this.row][this.rightColumn].check(); }
		if (fields[this.lowerRow]) {
			if (fields[this.lowerRow][this.leftColumn]) { fields[this.lowerRow][this.leftColumn].check(); }
			fields[this.lowerRow][this.column].check();
			if (fields[this.lowerRow][this.rightColumn]) { fields[this.lowerRow][this.rightColumn].check(); }
		}
	}
}

let fields = {};
let bombs = 0;
let emptyFields = 0;
let firstClick = function(event) {
	// get first clicked field
	let firstRow = parseInt(event.target.getAttribute('data-cell-row'));
	let firstColumn = parseInt(event.target.getAttribute('data-cell-column'));
	let bombPercent = document.getElementById('difficulty').value;

	// set bombs and field events
	let fieldRows = Array.from(document.getElementsByTagName('tr'));
	fieldRows.forEach((fieldRow, index) => {
		let row = index;
		let fieldColumns = Array.from(fieldRow.getElementsByTagName('td'));
		fieldColumns.forEach((field, index) => {
			let column = index;
			fields[row][column].setup(firstRow, firstColumn, bombPercent);

			field.removeEventListener('click', firstClick);
			field.addEventListener('click', event => {
				event.preventDefault();
				let fieldRow = parseInt(event.target.getAttribute('data-cell-row'));
				let fieldColumn = parseInt(event.target.getAttribute('data-cell-column'));
				// check field for bomb
				fields[fieldRow][fieldColumn].check();
			});
			field.addEventListener('contextmenu', event => {
				event.preventDefault();
				let fieldRow = parseInt(event.target.getAttribute('data-cell-row'));
				let fieldColumn = parseInt(event.target.getAttribute('data-cell-column'));
				// set/remove flag from field
				fields[fieldRow][fieldColumn].setFlag();
			});
		});
	});

	// show the number of bombs on the field
	let numberOfBombs = '<img src="img/bomb.png" alt="bombs"/>';
	bombs = bombs.toString();
	for (i = bombs.length - 1; i >= 0; i--) {
		numberOfBombs = '<img src="img/'+bombs[i]+'.png" alt="'+bombs[i]+'"/>' + numberOfBombs;
	}
	document.getElementById('bomb-number').innerHTML = numberOfBombs;

	// start game with click on first cell
	event.target.click();
}

function initializeField() {
	// build field
	let fieldSize = parseInt(document.getElementById('fieldsize').value);
	let minefieldMarkup = '';
	for (i = 0; i < fieldSize; i++) {
		minefieldMarkup += '<tr>';
		for (j = 0; j < fieldSize; j++) {
			minefieldMarkup += '<td data-cell-row="' + i + '" data-cell-column="' + j + '"></td>';
		}
		minefieldMarkup += '</tr>';
	}
	document.getElementById('minefield').innerHTML = minefieldMarkup;
	// setup field
	fields = {};
	bombs = 0;
	emptyFields = 0;
	document.getElementById('bomb-number').innerHTML = '';
	let fieldRows = Array.from(document.getElementsByTagName('tr'));
	fieldRows.forEach((fieldRow, index) => {
		let rowIndex = index;
		fields[rowIndex] = {};
		let fieldColumns = Array.from(fieldRow.getElementsByTagName('td'));
		fieldColumns.forEach((field, index) => {
			let columnIndex = index;
			// initialize minefield objects
			fields[rowIndex][columnIndex] = new Minefield(rowIndex, columnIndex);
			field.addEventListener('click', firstClick);
		});
	});
}

// settings functionality
let settings = {
	btn: document.getElementById('settings'),
	changed: 0,
	setting: {}
};
let cookies = document.cookie.split('; ');
Array.from(settings.btn.getElementsByTagName('select')).forEach((settingInput, index) => {
	// check if setting is saved in cookie
	cookies.forEach(cookie => {
		let cookieNameAndValue = cookie.split('=');
		let cookieName = 'minesweeperSetting' + index;
		if (cookieNameAndValue[0] == cookieName) {
			settingInput.value = cookieNameAndValue[1];
		}
	});
	settings.setting[index] = {
		input: settingInput,
		value: settingInput.value,
		label: settingInput.labels[0],
		labelHtml: settingInput.labels[0].innerHTML,
		changed: false
	};
	settingInput.addEventListener('change', () => {
		let currentSetting = settings.setting[index];
		if (currentSetting.value == currentSetting.input.value && currentSetting.changed == true) {
			currentSetting.changed = false;
			currentSetting.label.innerHTML = currentSetting.labelHtml;
			if (--settings.changed == 0) {
				settings.btn.classList.remove('changed');
			}
		} else if (currentSetting.changed == false) {
			currentSetting.changed = true;
			currentSetting.label.innerHTML = currentSetting.labelHtml + '*';
			if (settings.changed++ == 0) {
				settings.btn.classList.add('changed');
			}
		}
	});
});

// play buttons functionality
Array.from(document.getElementsByClassName('btn-play')).forEach(playBtn => {
	playBtn.addEventListener('click', event => {
		event.preventDefault();
		event.target.parentNode.parentNode.classList.remove('show');
		initializeField();
		settings.changed = 0;
		settings.btn.classList.remove('changed');
		for (item in settings.setting) {
			let currentSetting = settings.setting[item];
			currentSetting.changed = false;
			currentSetting.value = currentSetting.input.value;
			currentSetting.label.innerHTML = currentSetting.labelHtml;

			// save setting in cookie
			document.cookie = 'minesweeperSetting' + item + '=' + currentSetting.value + ';' + 'Max-Age=2592000;';
		}
	});
});

// start the game
initializeField();