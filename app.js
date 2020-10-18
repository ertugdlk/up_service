const Express = require('express')
const BodyParser = require('body-parser')
const Config     = require('config')
const Cors = require('cors')
const Mongoose = require('mongoose')
const Helmet = require('helmet')

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

const User = require('up_core/models/User')

const App = Express()

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


