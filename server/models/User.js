const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const ROLE_MEMBER = require('../config/constants').ROLE_MEMBER;
const ROLE_CLIENT = require('../config/constants').ROLE_CLIENT;
const ROLE_OWNER = require('../config/constants').ROLE_OWNER;
const ROLE_ADMIN = require('../config/constants').ROLE_ADMIN;

const Schema= mongoose.Schema;

let UserSchema = new Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    phone_number: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        first_name: { type: String },
        last_name: { type: String }
    },
    role: {
        type: String,
        enum: [ROLE_MEMBER, ROLE_CLIENT, ROLE_OWNER, ROLE_ADMIN],
        default: ROLE_MEMBER
    },
    stripe: {
        customerId: { type: String },
        subscriptionId: { type: String },
        lastFour: { type: String },
        plan: { type: String },
        activeUntil: { type: Date}
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
}, {
    timestamps: true
});

//=================================
// User ORM Methods
//=================================

UserSchema.pre('save', function(next) {
    const user = this;
    const SALT_FACTOR = 5;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
        if(err) return next(err);

        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if(err) return next(err);
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(password, next) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if(err) return next(err);
        next(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);