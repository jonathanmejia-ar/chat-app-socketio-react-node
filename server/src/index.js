const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);

const socketio = require('socket.io');
const io = socketio(server, {
    cors: {
        origin: "*",
    }
});

let users = [];

io.on('connection', (socket) => {
    let username;

    socket.on('connected', (name) => {
        username = name;
        socket.broadcast.emit('messages', { name: username, message: 'has joined the chat' });
        users.push(name)
        io.emit('users-online', users);
    });

    socket.on('message', (name, message) => {
        io.emit('messages', { name, message });
    });


    socket.on('typing', (name) => {
        socket.broadcast.emit('user-typing', name);
    });

    socket.on('disconnect', () => {
        users = users.filter(user => user !== username);
        io.emit('users-online', users);
        socket.broadcast.emit('user-typing', '');
        io.emit('messages', { name: username, message: `has left the chat` });
    });

});


server.listen(4000, () => console.log('listening on port: 4000'));