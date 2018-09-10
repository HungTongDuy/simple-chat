// const mongoose = require('mongoose');
// const Conversation = mongoose.model('Conversation');
// const User = mongoose.model('User');
// const Message = require.model('Message');

const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

exports.getConversations = (req, res, next) => {
    Conversation.find({
            participants: req.user._id
        })
        .populate('participants')
        //.select('_id participants.profile.first_name participants.profile.last_name')
        .select('_id')
        .exec((err, conversations) => {
            if (err) {
                res.send({
                    error: err
                });
                return next(err);
            }

            // Set up empty array to hold conversations + most recent message
            const fullConversations = [];
            conversations.forEach((conversation) => {
                const fullConversation = {};

                Message.find({
                        conversationId: conversation._id
                    })
                    .sort('-createdAt')
                    .limit(1)
                    .populate({
                        path: 'author',
                        select: 'profile.first_name profile.last_name'
                    })
                    .exec((err, message) => {
                        if (err) {
                            res.send({
                                error: err
                            });
                            return next(err);
                        }
                        fullConversation.participants = conversation.participants;
                        fullConversation.new_message = message[0];
                        fullConversations.push(fullConversation);
                        if (fullConversations.length === conversations.length) {
                            fullConversations.sort(function (a, b) {
                                return b.new_message.createdAt - a.new_message.createdAt
                            });
                            return res.status(200).json({
                                conversations: fullConversations
                            });
                        }
                    });
            });
        })
}

exports.getConversation = (req, res, next) => {
    const result = {};
    Conversation.findById(req.params.conversationId)
        .populate({
            path: 'participants'
        })
        .exec((err, conversation) => {
            if (err) {
                res.send({
                    error: err
                });
                return next(err);
            }

            Message.find({
                    conversationId: req.params.conversationId
                })
                .select('createdAt body author')
                .sort('-createAt')
                .populate({
                    path: 'author',
                    select: 'profile.first_name profile.last_name'
                })
                .exec((err, messages) => {
                    if (err) {
                        res.send({
                            error: err
                        });
                        return next(err);
                    }
                    result.participants = conversation.participants;
                    result.messages = messages;
                    return res.status(200).json({
                        conversation: result
                    });
                });
        })
}

exports.newConversation = (req, res, next) => {
    console.log('add-new-conver')
    if (!req.body.recipient) {
        res.status(422).send({
            error: 'Please choose a valid recipient for your message.'
        });
        return next();
    }

    if (!req.body.composedMessage) {
        res.status(422).send({
            error: 'Please enter a message.'
        });
        return next();
    }

    let recipient = req.body.recipient;
    recipient.push(req.user._id);

    const conversation = new Conversation({
        participants: recipient
    });

    conversation.save((err, newConversation) => {
        if (err) {
            res.send({
                error: err
            });
            return next(err);
        }

        if (req.body.composedMessage) {
            const message = new Message({
                conversationId: newConversation._id,
                body: req.body.composedMessage,
                author: req.user._id
            });

            message.save((err, newMessage) => {
                if (err) {
                    res.send({
                        error: err
                    });
                    return next(err);
                }
            });
        }
        return res.status(200).json({
            message: 'Conversation started!',
            conversationId: conversation._id
        });
    });
}

exports.sendReply = (req, res, next) => {
    const reply = new Message({
        conversationId: req.params.conversationId,
        body: req.body.composedMessage,
        author: req.user._id
    });

    reply.save((err, sentReply) => {
        if (err) {
            res.send({
                error: err
            });
            return next(err);
        }

        return res.status(200).json({
            message: 'Reply successfully sent!'
        });
    });
};

exports.deleteConversation = (req, res, next) => {
    const conversationId = req.params.conversationId;
    Message.find({
            conversationId: conversationId
        })
        .select('_id')
        .exec((err, message) => {
            if (err) {
                res.send({
                    error: err
                });
                return next(err);
            }
            message.map((item) => {
                Message.findOneAndDelete({
                    _id: item._id
                }).exec((err) => {
                    if (err) {
                        res.send({
                            error: err
                        });
                        return next(err);
                    }
                    next()
                })
            })
            Conversation.findById(conversationId)
            .exec((err, conversation) => {
                if (err) {
                    res.send({
                        error: err
                    });
                    return next(res);
                }
                if(!conversation) {
                    return res.status(404).json({
                        message: "Not found conversation"
                    })
                }
                Conversation.findOneAndDelete({
                    _id: conversationId
                }).exec((err) => {
                    if (err) {
                        res.send({
                            error: err
                        });
                        return res;
                    }
                    return res.status(200).json({
                        message: "Delete conversation success"
                    })
                })
            })
        })
}

exports.viewMessage = (req, res, next) => {
    Message.findById(req.body.message_id)
    .exec((err, message) => {
        if (err) {
            res.send({
                error: err
            });
            return next(res);
        }
        return message.viewMessage(req.body.user_id)
        .then(() => {
            res.json({ message: 'Done' })
        })
    })
}