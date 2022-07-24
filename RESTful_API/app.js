const express = require('express');
const fs = require('fs');
const port = 3030;

const app = express();
app.use(express.json());
const fileData = './users.json';
const userRouter = require('./routes/user-router');

app.use(userRouter);

app.listen(port, () => {
    console.log('Listening on port ', port);
});