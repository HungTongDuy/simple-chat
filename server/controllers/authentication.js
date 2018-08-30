// const mongoose = require('mongoose');
// const User = mongoose.model('User');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailgun = require('../config/mailgun');
// const mailchimp = require('../config/mailchimp');
const setUserInfo = require('../helpers').setUserInfo;
const getRole = require('../helpers').getRole;
const config = require('../config/main');

const generateToken = (user) => {
    return jwt.sign(user, config.secret, {
        expiresIn: 86400 // expires in 24 hours 
    })
}

module.exports = {
    login: (req, res, next) => {
        console.log('login----------')
        User.findOne({
            email: req.body.email
        }, (err, existingUser) => {
            if (err) return next(err);
    
            if (!existingUser) {
                return res.status(422).send({
                    error: 'that email address is do not exist.'
                });
            }

            existingUser.comparePassword(req.body.password, (err, isMatch) => {
                if (err) {
                    return done(err);
                }
                if (!isMatch) {
                    return done(null, false, {
                        error: 'Your login details could not be verified. Please try again.'
                    });
                }

                const userInfo = setUserInfo(existingUser);
    
                res.status(200).json({
                    token: generateToken(userInfo),
                    user: userInfo
                })
            });
        })
    },
    //= =======================================
    // Registration Route
    //= =======================================
    register: (req, res, next) => {
        console.log('register-route');
        const email = req.body.email;
        const first_name = req.body.first_name;
        const last_name = req.body.last_name;
        const password = req.body.password;
    
        if (!email) {
            return res.status(422).send({
                error: 'You must enter an email address.'
            });
        }
    
        if (!first_name || !last_name) {
            return res.status(422).send({
                error: 'You must enter your full name.'
            })
        }
    
        if (!password) {
            return res.status(422).send({
                error: 'You must enter a password.'
            })
        }
    
        User.findOne({
            email
        }, (err, existingUser) => {
            if (err) return next(err);
    
            if (existingUser) {
                return res.status(422).send({
                    error: 'that email address is already in use.'
                });
            }
    
            const user = new User({
                email,
                password,
                profile: {
                    first_name,
                    last_name
                }
            });
    
            user.save((err, newUser) => {
                if (err) return next(err);
    
                const userInfo = setUserInfo(newUser);
    
                res.status(201).json({
                    token: generateToken(userInfo),
                    user: userInfo
                });
            });
        });
    },
    //= =======================================
    // Authorization Middleware
    //= =======================================
    roleAuthorization: (requiredRole) => {
        return (req, res, next) => {
            const user = req.body.user;
    
            User.findById(user._id, (err, foundUser) => {
                if (err) {
                    res.status(422).json({
                        error: 'No user was found.'
                    });
                    return next(err);
                }
    
                if (getRole(foundUser.role) >= Role(requiredRole)) {
                    return next();
                }
    
                return res.status(401).json({
                    error: 'You are not authorized to view this content.'
                });
            });
        };
    },
    //= =======================================
    // Forgot Password Route
    //= =======================================
    forgotPassword: (req, res, next) => {
        const email = req.body.email;
    
        User.findOne({
            email
        }, (err, existingUser) => {
            if (err || existingUser == null) {
                res.status(422).json({
                    error: 'Your request could not be processed as entered. Please try again.'
                })
                return next(err);
            }
    
            crypto.randomBytes(48, (err, buffer) => {
                const resetToken = buffer.toString('hex');
                if (err) {
                    return next(err);
                }
    
                existingUser.resetPasswordToken = resetToken;
                existingUser.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
                existingUser.save((err) => {
                    // If error in saving token, return it
                    if (err) {
                        return next(err);
                    }
    
                    const message = {
                        subject: 'Reset Password',
                        text: `${'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                        'http://'}${req.headers.host}/reset-password/${resetToken}\n\n` +
                            `If you did not request this, please ignore this email and your password will remain unchanged.\n`
                    };
    
                    // Otherwise, send user email via Mailgun
                    mailgun.sendEmail(existingUser.email, message);
    
                    return res.status(200).json({
                        message: 'Please check your email for the link to reset your password.'
                    });
                });
            });
        })
    },
    //= =======================================
    // Reset Password Route
    //= =======================================
    verifyToken: (req, res, next) => {
        User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: {
                $gt: Date.now()
            }
        }, (err, resetUser) => {
            // If query returned no results, token expired or was invalid. Return error.
            if (!resetUser) {
                res.status(422).json({
                    error: 'Your token has expired. Please attempt to reset your password again.'
                });
            }
    
            // Otherwise, save new password and clear resetToken from database
            resetUser.password = req.body.password;
            resetUser.resetPasswordToken = undefined;
            resetUser.resetPasswordExpires = undefined;
    
            resetUser.save((err) => {
                if (err) {
                    return next(err);
                }
    
                // If password change saved successfully, alert user via email
                const message = {
                    subject: 'Password Changed',
                    text: 'You are receiving this email because you changed your password. \n\n' +
                        'If you did not request this change, please contact us immediately.'
                };
    
                // Otherwise, send user email confirmation of password change via Mailgun
                mailgun.sendEmail(resetUser.email, message);
    
                return res.status(200).json({
                    message: 'Password changed successfully. Please login with your new password.'
                });
            });
        });
    }
}