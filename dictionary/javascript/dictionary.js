 "use strict";

let g_repeater, g_words;

async function onload() {
    g_repeater = new Function('word', 
        'return `' + get('repeater').innerHTML + '`;'
    );
    get('repeater').innerHTML = '';
    const x = await fetch('./data/dictionary.txt');
    const y = await x.text();
    g_words = y.replaceAll('\r', '').split('\n');
}

function buttonClicked() {
    const reggie = ['^'];
    for (const c of get('word').value) {
        reggie.push( (c == '?') ? '.' : c.toLowerCase() );
    }
    reggie.push('$');
    const regex = new RegExp(reggie.join(''));
    const result = [];
    let i = 0;
    for (const word of g_words) {
        if (regex.test(word)) {
            i++;
            if (i > 200) {
                result.push('rest ignored ...');
                break;
            }
            result.push( g_repeater( word.toUpperCase() ));
        }
    }
    if (result.length == 0) {
        get('repeater').innerHTML = 'Nothing matches!';
    } else {
        get('repeater').innerHTML = result.join('');
    }
}

function get (id) {
    return window.document.getElementById(id);
}

function onkeyup2 () {
    get('repeater').innerHTML = '';
    const ra = get('word').value.split('');
    for (let i = 0; i < ra.length; i++) {
        switch (true) {
            case /[a-z]/.test(ra[i]):
                ra[i] = ra[i].toUpperCase();
                break;
            case /[A-Z]/.test(ra[i]):
                break;
            default:
                ra[i] = '?';
                break;
        }
    }
    get('word').value = ra.join('');
}