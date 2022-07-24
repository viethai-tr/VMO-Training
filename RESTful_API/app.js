const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const port = 3030;

const app = express();
app.use(express.json());
const fileData = './users.json';

// GET all users /users
app.get('/users', (req, res) => {
    fs.readFile(fileData, (err, data) => {
        if (err) throw err;
        res.end(data);
    });
});

// GET an user
app.get('/users/:id', (req, res) => {
    fs.readFile(fileData, (err, data) => {
        if (err) throw err;
        const userId = req.params['id'];
        let listUsers = JSON.parse(data);
        let userFilted = listUsers[userId];
        res.end(JSON.stringify(userFilted));
    });
});

// POST new user
app.post('/users', (req, res) => {
    fs.readFile(fileData, (err, data) => {
        if (err) throw err;
        let listData = JSON.parse(data);
        const newId = Object.keys(listData).length + 1;
        console.log(newId);
        listData[newId] = req.body;

        fs.writeFile(fileData, JSON.stringify(listData), (err) => {
            if (err) throw err;
            res.status(200).send('New User Added!');
        });
    });
});

// UPDATE a user
app.put("/users/:id", (req, res) => {
    fs.readFile(fileData, (err, data) => {
        if (err) throw err;
        let listData = JSON.parse(data);
        const userId = req.params['id'];
        listData[userId] = req.body;

        fs.writeFile(fileData, JSON.stringify(listData), (err) => {
            if (err) throw err;
            res.status(200).send('Updated User Successfully!');
        });
    });
});

// DELETE a user
app.delete("/users/:id", (req, res) => {
    fs.readFile(fileData, (err, data) => {
        if (err) throw err;
        let listData = JSON.parse(data);
        const userId = req.params['id'];
        delete listData[userId];

        fs.writeFile(fileData, JSON.stringify(listData), (err) => {
            if (err) throw err;
            res.status(200).send('Deleted User Successfully!');
        });
    });
});

const server = app.listen(port, () => {
    console.log('Listening on port ', port);
});