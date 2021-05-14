const express = require('express');
const http = require('http');
const moment = require('moment');
const socketio = require('socket.io');
const { joinRoom, leaveRoom, getRoomUsers, getCurrentUser } = require('./utils/users')
const app = express();
const server = http.createServer(app);

const io = socketio(server, {
    cors: {
        origin: "*",
    }
});

//Run when client connects
io.on('connection', (socket) => {

    socket.on('connected', (name, room) => {
        //User joins the room
        const currentUser = joinRoom(socket.id, name, room);
        socket.join(currentUser.room);

        //Send a connection notification and room info
        const time = moment().format('h:mm:ss');
        socket.to(currentUser.room).emit('messages', { name: currentUser.name, message: `Has joined the room`, time });
        const roomUsers = getRoomUsers(currentUser.room);
        io.to(currentUser.room).emit('users-online', roomUsers);
    });

    //Listen for message and emit the message
    socket.on('message', (name, message) => {
        const currentUser = getCurrentUser(socket.id);
        const time = moment().format('h:mm:ss');
        io.to(currentUser.room).emit('messages', { name, message, time });
    });

    //Broadcast when a user is typing
    socket.on('typing', (name) => {
        const currentUser = getCurrentUser(socket.id);
        socket.to(currentUser.room).emit('user-typing', name);
    });

    //Run when client disconnects
    socket.on('disconnect', () => {
        const currentUser = getCurrentUser(socket.id);

        if (currentUser) {
            leaveRoom(currentUser.id);
            //Send actual room info
            const roomUsers = getRoomUsers(currentUser.room);
            io.to(currentUser.room).emit('users-online', roomUsers);
            socket.to(currentUser.room).emit('user-typing', '');

            //Send a disconnect notification
            const time = moment().format('h:mm:ss');
            io.to(currentUser.room).emit('messages', { name: currentUser.name, message: `Has left the room`, time });
        }
    });

});


server.listen(4000, () => console.log('listening on port: 4000'));