const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const moment = require('moment');

const socketio = require('socket.io');
const io = socketio(server, {
    cors: {
        origin: "*",
    }
});
const { joinRoom, leaveRoom, getRoomUsers } = require('./users')

io.on('connection', (socket) => {

    let currentUser;
    socket.on('connected', (name, room) => {
        currentUser = joinRoom(socket.id, name, room);
        socket.join(currentUser.room);
        const time = moment().format('h:mm:ss');
        socket.to(currentUser.room).emit('messages', { name: currentUser.name, message: `Has joined the chat ${currentUser.room}`, time });
        const roomUsers = getRoomUsers(currentUser.room);
        io.to(currentUser.room).emit('users-online', roomUsers);
    });

    socket.on('message', (name, message) => {
        const time = moment().format('h:mm:ss');
        io.to(currentUser.room).emit('messages', { name, message, time });
    });

    socket.on('typing', (name) => {
        socket.to(currentUser.room).emit('user-typing', name);
    });

    socket.on('disconnect', () => {
        if (currentUser) {
            leaveRoom(currentUser.id);
            const roomUsers = getRoomUsers(currentUser.room);
            io.to(currentUser.room).emit('users-online', roomUsers);
            socket.to(currentUser.room).emit('user-typing', '');
            const time = moment().format('h:mm:ss');
            io.to(currentUser.room).emit('messages', { name: currentUser.name, message: `Has left the chat`, time });
        }
    });

});


server.listen(4000, () => console.log('listening on port: 4000'));