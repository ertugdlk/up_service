const Express = require('express')
const BodyParser = require('body-parser')
const Config = require('config')
const Cors = require('cors')
const Mongoose = require('mongoose')
const Helmet = require('helmet')
const passport = require('up_core/passport/setup')
const Cookie = require('cookie-parser')
const Websockets = require('up_core/utils/Websockets')
const Http = require('http')

//DATABASE
Mongoose.set('useFindAndModify', false) // FindAndModify method is deprecated. If this line is not exists, then it throws error.
Mongoose.set('useCreateIndex', true) // ensureIndex is deprecated. If this line is not exists, then it throws error.
Mongoose.connect(Config.get('database.url'), { useNewUrlParser: true });

Mongoose.connection.on('open', (d) => {
  console.log('# --> Database connection is opened. (Server)')
})
Mongoose.connection.on("error", function (err) {
  console.log("Could not connect to mongo server!");
  return console.log(err);
});

//CORS Settings
const whitelist = ['https://f0c1d1bc37c8.ngrok.io', '213.243.44.6:27015']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}

const App = Express()

App.use(passport.initialize())
App.use(Helmet())
App.use(BodyParser.json())
App.use(BodyParser.urlencoded({ extended: true }))
App.use(Cors(corsOptions))
App.use(Cookie())

const server = Http.createServer(App);
const SocketIO = require('socket.io')(server)
global.io = SocketIO;
global.io.on('connection', Websockets.connection)


//Service
server.listen(process.env.PORT || 5000)

App.get('/', (req, res) => res.json({
  msg: 'Hello, welcome to unkownpros API service',
  Endpoints: " Create Credential: POST /credential/create"
}));

const Authentication = require('./middlewares/AuthenticationValidation')

//Routes
App.use('/auth', require('./routes/AuthenticationRoute'))
App.use('/credential', require('./routes/CredentialRoute'))
App.use('/steam', require('./routes/SteamRoute'))
App.use('/detail', require('./routes/DetailRoute'))
App.use('/room' ,require('./routes/GameRoomRoute'))
App.use('/rcon' , require('./routes/RconRoute'))

App.get('/steam/auth',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function (req, res) {
    res.redirect('/');
  });

App.get('/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function (req, res) {
    res.redirect('localhost:3000/dashboard');
  });


