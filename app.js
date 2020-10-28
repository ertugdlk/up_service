const Express = require('express')
const BodyParser = require('body-parser')
const Config     = require('config')
const Cors = require('cors')
const Mongoose = require('mongoose')
const Helmet = require('helmet')
const passport = require('up_core/passport/setup')

//DATABASE
Mongoose.set('useFindAndModify', false) // FindAndModify method is deprecated. If this line is not exists, then it throws error.
Mongoose.set('useCreateIndex', true) // ensureIndex is deprecated. If this line is not exists, then it throws error.
Mongoose.connect(Config.get('database.url'), { useNewUrlParser: true});

Mongoose.connection.on('open', (d) => 
{
    console.log('# --> Database connection is opened. (Server)')
})
Mongoose.connection.on("error", function(err) {
    console.log("Could not connect to mongo server!");
    return console.log(err);
});

const App = Express()

App.use(passport.initialize())
App.use(Helmet())
App.use(BodyParser.json())
App.use(BodyParser.urlencoded({ extended: true }))
App.use(Cors())


//Service
App.listen(process.env.PORT || 5000)

App.get( '/' , (req,res) => res.json({msg:'Hello, welcome to unkownpros API service', 
Endpoints:" Create Credential: POST /credential/create"
}));

//Routes
App.use('/auth' , require('./routes/AuthenticationRoute'))
App.use('/credential', require('./routes/CredentialRoute'))
App.use('/steam', require('./routes/SteamRoute'))

App.get('/steam/auth',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

App.get('/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });


