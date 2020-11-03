const Express = require('express')
const BodyParser = require('body-parser')
const Config = require('config')
const Cors = require('cors')
const Mongoose = require('mongoose')
const Helmet = require('helmet')
const passport = require('up_core/passport/setup')
const session = require('express-session');
const Redis = require('redis');
const RedisClient = Redis.createClient({
  host: process.env.redis_host, port: process.env.redis_port,
  password: process.env.redis_password
})
const RedisStore = require('connect-redis')(session);

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


const App = Express()

RedisClient.on('error', (err) => {
  console.log('Redis error: ', err)
})


App.use(session({
  secret: process.env.session_key,
  resave: false,
  saveUninitialized: true,
  store: new RedisStore({ client: RedisClient }),
  cookie: { secure: false, maxAge: 86400 },
}))


App.use(passport.initialize())
App.use(Helmet())
App.use(BodyParser.json())
App.use(BodyParser.urlencoded({ extended: true }))
App.use(Cors())


//Service
App.listen(process.env.PORT || 5000)

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

App.get('/steam/auth',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function (req, res) {
    res.redirect('/');
  });

App.get('/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function (req, res) {
    res.redirect('/');
  });


