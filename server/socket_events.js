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

        socket.on(socket_key.TYPING, (conversation, full_name) => {
            console.log('typing message ', conversation + ' - ' + full_name);
            io.sockets.in(conversation).emit(socket_key.TYPING, conversation, full_name);
        });

        socket.on(socket_key.ENTER_USER, (user_id) => {
            socket.join(user_id);
            console.log('joined user_id: ', user_id);
        });

        socket.on(socket_key.LEAVE_USER, (user_id) => {
            socket.leave(user_id);
            console.log('left user_id: ', user_id);
        });

        socket.on(socket_key.NEW_CONVERSATION, (conversation, user_id) => {
            console.log('new conversation ', user_id);
            io.sockets.in(user_id).emit(socket_key.NEW_CONVERSATION, conversation);
        })

        socket.on(socket_key.DISCONECT, () => {
            console.log('user disconnected');
        });
    });
};