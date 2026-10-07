"use strict";

import { exec } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const port = 8081;
const url = 'http://localhost:' + port + '/index.html';
console.log(url);
exec('open "' + url + '"');

createServer(async (req, res) => {
    try {
        console.log('.' + req.url);
        let data;
        switch (true) {
            case req.url.endsWith('.png'):
            case req.url.endsWith('.ico'):
                data = await readFile('./images' + req.url);
                break;
            default:
                data = await readFile('.' + req.url);
        }
        res.end(data);
    }
    catch (err) {
        console.log(err);
        res.end();
        process.exit(0);
    }
}).listen(port);
