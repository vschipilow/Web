//
//  Sudoku.js
//  LocalWebSite
//
//  Created by Victor Schipilow on 13/3/2026.
//

"use strict";

let model, view;

function onload() {
    try {
        model = new Model();
        view = new View();
        changeGrid();
    }
    catch (err) {
        console.log(err);
        alert('ERROR');
    }
}

function back() {
    try {
        view.updateGrid(model.back().id, model.enteredNos, model.found, model.pattern);
    }
    catch (err) {
        console.log(err);
        alert('ERROR');
    }
}

function changeGrid() {
    try {
        model.initialiseGrid(get('gridType').value);
        view.buildGrid(model.size, model.width, model.height);
    }
    catch (err) {
        console.log(err);
        alert('ERROR');
    }
}

function cleanseInput(id, i, j) {
    try {
        const convertToNum = (model.gridType == '33N');
        const char = view.getCleanInput(id, i, j, convertToNum, model.pattern);
        model.changeInput(char, i, j, id);
        view.updateGrid('', model.enteredNos, model.found, model.pattern);
    }
    catch (err) {
        console.log(err);
        alert('ERROR');
    }
}

function get (id) {
    try {
        return window.document.getElementById(id);
    }
    catch (err) {
        console.log(err);
        alert('ERROR');
    }
}

class Model {
    initialiseGrid(gridType) {
        try {
            this.gridType = gridType;
            this.width = parseInt(gridType[0]);
            this.height = parseInt(gridType[1]);
            this.size = this.width * this.height;
            this.numeric = this.gridType[2] == 'N';
            this.pattern = (this.numeric ? '123456789ABCDEFGHIJK' : 'ABCDEFGHIJKLMNOPQRST').substr(0, this.size);
            this.enteredNos = [];
            for (let i = 0; i < this.size; i++) {
                const row = [];
                for (let j = 0; j < this.size; j++) {
                    row.push(0);
                }
                this.enteredNos.push(row);
            }
            this.entries = [];
        }
        catch (err) {
            console.log(err);
            alert('ERROR');
        }
    }

    changeInput(char, row, col, id) {
        try {
            const num = this.enteredNos[row][col];
            const newNum = (char == '') ? 0 : this.pattern.indexOf(char) + 1;
            if (newNum != num) {
                this.entries.push( { id, row,  col, num } );
                this.enteredNos[row][col] = newNum;
            }
            this.search();
        }
        catch (err) {
            console.log(err);
            alert('ERROR');
        }
    }

    back() {
        try {
            const entry = this.entries.pop();
            if (entry) {
                this.enteredNos[entry.row][entry.col] = entry.num;
                this.search();
                return entry;
            }
            return { id: '' };
        }
        catch (err) {
            console.log(err);
            alert('ERROR');
        }
    }

    search() {
        try {
            this.found = [];
            for (let i = 0; i < this.size; i++) {
                const foundRow = [];
                for (let j = 0; j < this.size; j++) {
                    let tempInt = this.enteredNos[i][j];
                    foundRow.push(tempInt);
                }
                this.found.push(foundRow);
            }
            this.sudoku();
        }
        catch (err) {
            console.log(err);
            alert('ERROR');
        }
    }

    sudoku() {
        try {
            //
            // "found" contains sudoku 2 dimensional array of numbers
            // if alpha sudoku or numeric sudoku with more than 9 numbers,
            // then alphas have been converted to numbers
            // ie A, B, C, D........ => 1, 2, 3, 4..........
            // or ....8, 9, A, B...... => ...8, 9, 10, 11.....
            //
            // SUDOKU
            //
            let rax;
            let changed = true;
            while (changed) {
                changed = false;
                rax = []; // array of rows
                for (let i = 0; i < this.size; i++) { // for each row
                    let y = []; // array of columns
                    for (let j = 0; j < this.size; j++) { // for each column
                        let z = [];  // list of candidates for given cell
                        if (this.found[i][j] == 0) {
                            for (let n = 1; n <= this.size; n++) {
                                if (this.isValid(i, j, n)) {
                                    // true if "n" does not exist in same row, column and box as cell[i][j]
                                    z.push(n);
                                }
                            }
                        }
                        y.push(z);
                    }
                    rax.push(y);
                }
                for (let i = 0; i < this.size; i++) {
                    for (let j = 0; j < this.size; j++) {
                        // true if number is only valid number in that cell
                        if (rax[i][j].length == 1) {
                            this.found[i][j] = rax[i][j][0];
                            console.log(`${i}, ${j}, ${rax[i][j][0]}`);
                            changed = true;
                            break;
                        }
                    }
                    if (changed) break;
                }
                if (changed == false) {
                    for (let i = 0; i < this.size; i++) {
                        // true if number can only appear once in a row
                        changed = this.check(rax, i, i, 0, this.size - 1);
                        if (changed) break;
                        // true if number can only appear once in a column
                        changed = this.check(rax, 0, this.size - 1, i, i);
                        if (changed) break;
                    }
                }
                if (changed == false) {
                    for (let i = 0; i < this.size; i += this.height) {
                        for (let j = 0; j < this.size; j += this.width) {
                            // true if number can only appear once in a box
                            changed = this.check(rax, i, i + this.height - 1, j, j + this.width - 1);
                            if (changed) break;
                        }
                        if (changed) break;
                    }
                }
            }
        }
        catch (err) {
            console.log(err);
            alert('ERROR');
        }
    }

    isValid(i, j, n) {
        try {
            // true if "n" does not exist in same row, column and box as cell[i, j]
            for (let k = 0; k < this.size; k++) {
                if (this.found[i][k] == n) {
                    return false;
                }
                if (this.found[k][j] == n) {
                    return false;
                }
            }
            // x & y are top left corner of width X height square surrounding cell 'i j'
            let x = Math.trunc(i / this.height) * this.height;
            let y = Math.trunc(j / this.width) * this.width;
            for (let p = x; p < x + this.height; p++) {
                for (let q = y; q < y + this.width; q++) {
                    if (this.found[p][q] == n) {
                        return false;
                    }
                }
            }
            return true;
        }
        catch (err) {
            console.log(err);
            alert('ERROR');
        }
    }

    check (rax, xFrom, xTo, yFrom, yTo) {
        try {
            let foundX = 0;
            let foundY = 0;
            for (let n = 1; n <= this.size; n++) {
                let timesFound = 0;
                for (let i = xFrom; i <= xTo; i++) { // for each row
                    for (let j = yFrom; j <= yTo; j++) { // for each column
                        for (let k = 0; k < rax[i][j].length; k++) { // for each valid value in the cell
                            if (rax[i][j][k] == n) {
                                timesFound++;
                                foundX = i;
                                foundY = j;
                            }
                        }
                    }
                }
                if (timesFound == 1) {
                    this.found[foundX][foundY] = n;
                    console.log(`${foundX}, ${foundY}, ${n}`);
                    return true;
                }
            }
            return false;
        }
        catch (err) {
            console.log(err);
            alert('ERROR');
        }
    }
}

class View {
    constructor() {
        try {
            this.gridType = get('gridType').value;
            const colRepeaterText = get('colRepeater').innerHTML.replace('<!-- ', '<').replace(' -->', '>');
            this.colRepeater = new Function('y', 'return `' + colRepeaterText + '`;');
            this.rowRepeater = new Function('y', 'return `<tr>${y.colRepeater}</tr>`;');
            get('rowRepeater').innerHTML = '';
        }
        catch (err) {
            console.log(err);
            alert('ERROR');
        }
    }
    
    buildGrid (size, width, height) {
        try {
            this.size = size;
            this.width = width;
            this.height = height;
            const table = [];
            for (let i = 0; i < size; i++) {
                const row = [];
                for (let j = 0; j < size; j++) {
                    const y = { i, j };
                    y.borderStyle = this.createBorderStyle(i, j);
                    y.id = this.createId(i, j);
                    row.push( this.colRepeater(y) );
                }
                table.push( this.rowRepeater({ colRepeater: row.join('') }) );
            }
            get('rowRepeater').innerHTML = table.join('');
        }
        catch (err) {
            console.log(err);
            alert('ERROR');
        }
	}

    getCleanInput(id, i, j, convertToNum, pattern) {
        try {
            const char = this.getValue(id);
            get(this.createNextId(i, j)).focus();
            if (pattern.includes(char)) {
                this.setValue(id, char, 'entered');
                return char;
            } else if (convertToNum) {
                let tempChar = ('ABCDEFGHI'.indexOf(char) + 1).toString();
                this.setValue(id, tempChar, 'entered');
                return tempChar;
            } else {
                this.setValue(id, '', 'calculated');
                return char;
            }
        }
        catch (err) {
            console.log(err);
            alert('ERROR');
        }
    }

    updateGrid(id, entered, found, pattern) {
        try {
            found.forEach((row, i) => {
                row.forEach((num, j) => {
                    const id = this.createId(i, j);
                    if (num == 0) {
                        this.setValue(id, '', 'calculated');
                    } else {
                        const char = pattern[num - 1];
                        const className = (entered[i][j] == 0) ? 'calculated' : 'entered';
                        this.setValue(id, char, className);
                    }
                });
            });
            if (id) {
                get(id).focus();
            }
        }
        catch (err) {
            console.log(err);
            alert('ERROR');
        }
    }

    createId(i, j) {
        try {
            return String.fromCharCode('a'.charCodeAt(0) + i).concat(j + 1);
        }
        catch (err) {
            console.log(err);
            alert('ERROR');
        }
    }

    setValue (id, value, className) {
        try {
            const input = get(id);
            input.value = value;
            input.className = className;
        }
        catch (err) {
            console.log(err);
            alert('ERROR');
        }
    }

    getValue (id) {
        try {
            let tag = get(id);
            let char = tag.value.trim();
            if (char == '') {
                return '0';
            } else {
                return char.substring(0, 1).toUpperCase();
            }
        }
        catch (err) {
            console.log(err);
            alert('ERROR');
        }
    }

    createNextId(i, j) {
        try {
            let n = j + 1;
            let m = i;
            if (n >= this.size) {
                n = 0;
                m++;
                if (m >= this.size) {
                    m = 0;
                }
            }
            return this.createId(m, n);
        }
        catch (err) {
            console.log(err);
            alert('ERROR');
        }
    }

    createBorderStyle (i, j) {
        try {
            let left = ((j + 1) % this.width == 1) ? 'thick' : 'thin';
            let right = ((j + 1) % this.width == 0) ? 'thick' : 'thin';
            let top = ((i + 1) % this.height == 1) ? 'thick' : 'thin';
            let bottom = ((i + 1) % this.height == 0) ? 'thick' : 'thin';
            return `border: 1px solid; border-width: ${top} ${right} ${bottom} ${left};`;
        }
        catch (err) {
            console.log(err);
            alert('ERROR');
        }
    }
}

