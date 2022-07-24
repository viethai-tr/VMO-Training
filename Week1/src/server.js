const http = require('http');
const events = require('events');
const fs = require('fs');
const url = require('url');
const { parse } = require('querystring');
const nodemailer = require('nodemailer');
const formidable = require('formidable');
const mv = require('mv');
const port = 3000;

const writeToFile = require('./write-to-file');
const mailSender = require('./mail-sender');

function search(req, res) {
    fs.readFile('./views/search.html', (err, data) => {
        if (err) throw err;
        res.write(data);
        if (req.method === 'GET') {
            var q = url.parse(req.url, true).query;
            console.log(q);
        }
        res.end();
    });
}

const server = http.createServer((req, res) => {
    var url = req.url;
    if (url === '/') {
        fs.readFile('./views/index.html', (err, data) => {
            if (err) throw err;
            res.write(data);
            res.end();
        });
    }
    else if (url === '/input') {
        writeToFile.write(req, res, './views/input.html', './test.txt');
    }
    else if (url === '/search') {
        search(req, res);
    }
    else if (url === '/node-maller') {
        mailSender.mailSender(req, res);
    }
});

server.listen(port, function () {
    console.log(`server start at port ${port}`);
});