const mongoose = require('mongoose');

const ConversationSchema = mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId }]
});

module.exports = mongoose.model('Conversation', ConversationSchema);