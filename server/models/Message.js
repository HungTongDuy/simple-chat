const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    viewer: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, {
    timestamps: true
})

MessageSchema.methods.viewMessage = function(user) {
    if(this.viewer.indexOf(user) < 0) {
        this.viewer.push(user)
    }
    return this.save()
}

module.exports = mongoose.model('Message', MessageSchema);