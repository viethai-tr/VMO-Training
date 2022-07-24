const express = require('express');
const app = express();
const server = require('http').Server(app);
const { v4: uuidV4 } = require('uuid');
const io = require("socket.io")(server);

// const upload = require('../public/js/streaming');

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/streaming", (req, res) => {
  res.render('streaming');
});

app.get("/", (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

app.get("/:room", (req, res) => {
  res.render('room', { roomId: req.params.room });
});

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId, userName) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);

    socket.on('message', message => {
      console.log("Username:", userName);
      io.to(roomId).emit('createMessage', message, userName);
    });

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId);
    });
  });
});

server.listen(3030);