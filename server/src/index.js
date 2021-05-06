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
const { joinRoom, leaveRoom, gerRoomUsers } = require('./users')

io.on('connection', (socket) => {

    let currentUser;
    socket.on('connected', (name, room) => {
        currentUser = joinRoom(socket.id, name, room);
        socket.join(currentUser.room)
        socket.to(currentUser.room).emit('messages', { name: currentUser.name, message: `has joined the chat ${currentUser.room}` });
        const roomUsers = gerRoomUsers(currentUser.room);
        io.to(currentUser.room).emit('users-online', roomUsers);
    });

    socket.on('message', (name, message) => {
        io.to(currentUser.room).emit('messages', { name, message });
    });


    socket.on('typing', (name) => {
        socket.to(currentUser.room).emit('user-typing', name);
    });

    socket.on('disconnect', () => {
        if (currentUser) {
            leaveRoom(currentUser.id);
            const roomUsers = gerRoomUsers(currentUser.room);
            io.to(currentUser.room).emit('users-online', roomUsers);
            socket.to(currentUser.room).emit('user-typing', '');
            io.to(currentUser.room).emit('messages', { name: currentUser.name, message: `has left the chat` });
        }
    });

});


server.listen(4000, () => console.log('listening on port: 4000'));