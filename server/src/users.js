let users = [];

const joinRoom = (id, name, room) => {
    const user = { id, name, room };
    users.push(user)
    return user;
};

const leaveRoom = (id) => {
    users = users.filter(user => user.id !== id);
};

const gerRoomUsers = (room) => {
    const roomUsers = users.filter(user => user.room === room);
    return roomUsers;
};

const getCurrentUser = (id) => {
    const user = users.find(user => user.id === id);
    return user;
};

module.exports = {
    joinRoom,
    leaveRoom,
    gerRoomUsers,
    getCurrentUser
};