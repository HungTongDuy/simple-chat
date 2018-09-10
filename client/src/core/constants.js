export const socket_key = {
    CONNECTION: 'connection',
    ENTER_CONVERSATION: 'enter conversation',
    LEAVE_CONVERSATION: 'leave conversation',
    NEW_MESSAGE: 'new message',
    REFRESH_MESSAGES: 'refresh messages',
    REFRESH_CONVERSATIONS: 'refresh conversations',
    NEW_CONVERSATION: 'new conversation',
    ENTER_USER: 'enter user',
    LEAVE_USER: 'leave user',
    DISCONECT: 'disconnect',
    TYPING: 'typing'
}

const server = 'http://localhost'
const port_client = 5002;
const port_api = 5000;

export const url_client = server + ':' + port_client;
export const url_api = server + ':' + port_api;

