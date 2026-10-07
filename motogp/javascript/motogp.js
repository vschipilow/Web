//
//  motogp.js
//  Node
//
//  Created by Victor Schipilow on 27/9/2025.
//
 
"use strict";

let g_rows, g_repeater;

async function onload() {
    const e = get('repeater');
    g_repeater = new Function ('row', 'return `' + e.innerHTML + '`;');
    e.innerHTML = '';
	const x = await fetch('./data/motogp.json');
	g_rows = await x.json();
    const now = new Date();
    for (const row of g_rows) {
        row.Age = calcAge(row.Birthdate);
    }
    sortByNo();

    function calcAge (dobString) {
        const dob = new Date(dobString);
        const age = now.getFullYear() - dob.getFullYear();
        switch (true) {
            case dob.getMonth() > now.getMonth():
                return age - 1;
            case dob.getMonth() < now.getMonth():
                return age;
            case dob.getDate() > now.getDate():
                return age - 1;
            default:
                return age;
        }
    }
}

function changeComp () {
    const year = get('year').value;
    const comp = get('comp').value;
    const rows = g_rows.filter( value => {
        return value.Year == year && value.Comp == comp;
    });
    const tableRows = [];
    for (const row of rows) {
        tableRows.push(g_repeater(row));
    }
    get('repeater').innerHTML = tableRows.join('\n');
}

function get (id) {
    return window.document.getElementById(id);
}

function nbsp (a) {
    return a.replaceAll(' ', '&nbsp;').replaceAll('-', '&#8209;');
}

function sortByAge() {
    g_rows.sort( (a, b) => {
        if (a.Age == b.Age) {
            return parseInt(a.Number) - parseInt(b.Number);
        } else {
            return parseInt(a.Age) - parseInt(b.Age);
        }
    });
    changeComp();
}

function sortByBike () {
    g_rows.sort( (a, b) => {
        switch (true) {
            case a.Bike < b.Bike:
                return -1;
            case a.Bike > b.Bike:
                return 1;
            default:
                return parseInt(a.Number) - parseInt(b.Number);
        }
    });
    changeComp();
}

function sortByCountry () {
    g_rows.sort( (a, b) => {
        switch (true) {
            case a.Country < b.Country:
                return -1;
            case a.Country > b.Country:
                return 1;
            default:
                return parseInt(a.Number) - parseInt(b.Number);
        }
    });
    changeComp();
}

function sortByFirstName () {
    g_rows.sort( (a, b) => {
        switch (true) {
            case a.FirstName < b.FirstName:
                return -1;
            case a.FirstName > b.FirstName:
                return 1;
            case a.Surname < b.Surname:
                return -1;
            case a.Surname > b.Surname:
                return 1;
            default:
                return parseInt(a.Number) - parseInt(b.Number);
        }
    });
    changeComp();
}

function sortByNo () {
    g_rows.sort( (a, b) => {
        return parseInt(a.Number) - parseInt(b.Number);
    });
    changeComp();
}

function sortBySurname () {
    g_rows.sort( (a, b) => {
        switch (true) {
            case a.Surname < b.Surname:
                return -1;
            case a.Surname > b.Surname:
                return 1;
            case a.FirstName < b.FirstName:
                return -1;
            case a.FirstName > b.FirstName:
                return 1;
            default:
                return parseInt(a.Number) - parseInt(b.Number);
        }
    });
    changeComp();
}

function sortByTeam () {
    g_rows.sort( (a, b) => {
        switch (true) {
            case a.Team < b.Team:
                return -1;
            case a.Team > b.Team:
                return 1;
            case a.TestRider == b.TestRider:
                return parseInt(a.Number) - parseInt(b.Number);
            case a.TestRider == '':
                return -1;
            default:
                return 1;
        }
    });
    changeComp();
}

function sortByTestRider () {
    g_rows.sort( (a, b) => {
        switch (true) {
            case a.TestRider == b.TestRider:
                return parseInt(a.Number) - parseInt(b.Number);
            case a.TestRider == '':
                return -1;
            default:
                return 1;
        }
    });
    changeComp();
}