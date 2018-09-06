const AuthenticationController = require('../controllers/authentication');
const UserController = require('../controllers/user');
const ChatController = require('../controllers/chat');
const CommunicationController = require('../controllers/communication');
// const StripeController = require('../controllers/stripe');
const express = require('express');
const passport = require('passport');
const ROLE_MEMBER = require('../config/constants').ROLE_MEMBER;
const ROLE_CLIENT = require('../config/constants').ROLE_CLIENT;
const ROLE_OWNER = require('../config/constants').ROLE_OWNER;
const ROLE_ADMIN = require('../config/constants').ROLE_ADMIN;

const config = require('../config/main');
const jwt = require('jsonwebtoken');

// const passportService = require('../config/passport');

// Middleware to require login/auth
// const requireAuth = passport.authenticate('jwt', {
//     session: false
// });
// const requireLogin = passport.authenticate('local', {
//     session: false
// });

function requireToken(req, res, next) {
    console.log('x-access-token');
	// check header or url parameters or post parameters for token
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.secret, function(err, decoded) {			
            if (err) {
                console.log(err);
                return res.status(403).json({ success: false, message: 'Failed to authenticate token.' });		
            } else {
                // if everything is good, save to request for use in other routes
                //console.log('verify successed', decoded);
                req.user = decoded;
                next();
            }
        });
    } else {
        // if there is no token
        // return an error
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.'
        });
    }
}

module.exports = function (app) {
    // Initializing route groups
    const apiRoutes = express.Router();
    const authRoutes = express.Router();
    const userRoutes = express.Router();
    const chatRoutes = express.Router();
    const payRoutes = express.Router();
    const communicationRoutes = express.Router();

    //= ========================
    // Auth Routes
    //= ========================

    // Set auth routes as subgroup/middleware to apiRoutes
    apiRoutes.use('/auth', authRoutes);

    // Registration route
    authRoutes.post('/register', AuthenticationController.register);

    // Login route
    authRoutes.post('/login', AuthenticationController.login);

    // Reconnect user
    authRoutes.post('/reconnect/:__user', AuthenticationController.reconnect);

    // Password reset request route (generate/send token)
    authRoutes.post('/forgot-password', AuthenticationController.forgotPassword);

    // Password reset route (change password using token)
    authRoutes.post('/reset-password/:token', AuthenticationController.verifyToken);

    //= ========================
    // User Routes
    //= ========================

    // Set user routes as a subgroup/middleware to apiRoutes
    apiRoutes.use('/user', userRoutes);

    // View user list 

    // View user profile route
    userRoutes.get('/:userId', requireToken, UserController.viewProfile);

    // Test protected route
    apiRoutes.get('/protected', requireToken, (req, res) => {
        res.send({
            content: 'The protected test route is functional!'
        });
    });

    apiRoutes.get('/admins-only', requireToken, AuthenticationController.roleAuthorization(ROLE_ADMIN), (req, res) => {
        res.send({
            content: 'Admin dashboard is working.'
        });
    });

    //= ========================
    // Chat Routes
    //= ========================

    // Set chat routes as a subgroup/middleware to apiRoutes
    apiRoutes.use('/chat', chatRoutes);

    // View messages to and from authenticated user
    chatRoutes.get('/', requireToken, ChatController.getConversations);

    // Retrieve single conversation
    chatRoutes.get('/:conversationId', requireToken, ChatController.getConversation);

    // Send reply in conversation
    chatRoutes.post('/rep/:conversationId', requireToken, ChatController.sendReply);

    // Start new conversation
    chatRoutes.post('/new', requireToken, ChatController.newConversation);

    //= ========================
    // Payment Routes
    //= ========================
    apiRoutes.use('/pay', payRoutes);

    // Webhook endpoint for Stripe
    // payRoutes.post('/webhook-notify', StripeController.webhook);

    // // Create customer and subscription
    // payRoutes.post('/customer', requireAuth, StripeController.createSubscription);

    // // Update customer object and billing information
    // payRoutes.put('/customer', requireAuth, StripeController.updateCustomerBillingInfo);

    // // Delete subscription from customer
    // payRoutes.delete('/subscription', requireAuth, StripeController.deleteSubscription);

    // // Upgrade or downgrade subscription
    // payRoutes.put('/subscription', requireAuth, StripeController.changeSubscription);

    // // Fetch customer information
    // payRoutes.get('/customer', requireAuth, StripeController.getCustomer);

    //= ========================
    // Communication Routes
    //= ========================
    apiRoutes.use('/communication', communicationRoutes);

    // Send email from contact form
    communicationRoutes.post('/contact', CommunicationController.sendContactForm);

    // Set url for API group routes
    app.use('/api', apiRoutes);
};