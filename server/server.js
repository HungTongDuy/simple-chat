const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const body_parser = require('body-parser');
const logger = require('morgan');
const router = require('./router');
const mongoose = require('mongoose');
const config = require('./config/main');

const socket_events = require('./socket_events');

//app.set('views', path.join(__dirname, 'views'))
//app.set('view engine', 'pug')

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/views/index.html');
//     //res.render('index.html')
// })
app.use(cors());
app.use(body_parser.json());
app.use(body_parser.urlencoded({
    extended: false
}))
app.use(logger('dev'));
// app.use(express.static('public'));

// let URL_DB = DATABASE_LOCAL;
// if(isProduction) {
//     URL_DB = DATABASE_SERVER;
// }
mongoose.connect('mongodb://localhost:27017/simple_chat', {
    //useMongoClient: true,
    useNewUrlParser: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Add models
// require('./models/Message');
// require('./models/User');
// require('./models/Conversation');

let server;
if (process.env.NODE_ENV != config.test_env) {
    server = app.listen(config.port, () => {
        console.log('App running on port ', config.port);
    })
} else {
    server = app.listen(config.test_port);
}

const io = require('socket.io').listen(server);

socket_events(io);

// app.post('/sendmsg', (req, res) => {
//     console.log(req.body.name + ' - ' + req.body.message);

//     io.emit(req.body.chatter, `${req.body.name}: ${req.body.message}`);
//     io.on('connection', (socket) => {
//         console.log('user connected');
//         socket.on('chatter', (message) => {
//             console.log('message', message);
//             io.emit('chatter', message);

//         });
//     })
// })

// Enable CORS from client-side
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

router(app);

module.exports = server;