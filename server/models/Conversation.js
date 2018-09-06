const mongoose = require('mongoose');

const ConversationSchema = mongoose.Schema({
    participants: [
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    avatar: String,
    name: String
});

module.exports = mongoose.model('Conversation', ConversationSchema);