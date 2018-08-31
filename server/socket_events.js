const socket_key = require('./config/socket_key');

module.exports = (io) => {
    console.log('socket.io connected');
    io.on(socket_key.CONNECTION, (socket) => {
        console.log('user connected');

        socket.on(socket_key.ENTER_CONVERSATION, (conversation) => {
            socket.join(conversation);
            console.log('joined ', conversation);
        });

        socket.on(socket_key.LEAVE_CONVERSATION, (conversation) => {
            socket.leave(conversation);
            console.log('left ', conversation);
        });

        socket.on(socket_key.NEW_MESSAGE, (conversation) => {
            console.log('new message server: ', conversation);
            io.sockets.in(conversation).emit(socket_key.REFRESH_MESSAGES, conversation);
        });

        socket.on(socket_key.DISCONECT, () => {
            console.log('user disconnected');
        });
    });
};