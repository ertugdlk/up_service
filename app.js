const Express = require('express')
const BodyParser = require('body-parser')
const Config     = require('config')
const Cors = require('cors')
const Mongoose = require('mongoose')

const App = Express()

App.use(BodyParser.json())
App.use(BodyParser.urlencoded({ extended: true }))
App.use(Cors())

//DATABASE
const dbUrl = Config.get('database.url');
Mongoose.set('useFindAndModify', false) // FindAndModify method is deprecated. If this line is not exists, then it throws error.
Mongoose.set('useCreateIndex', true) // ensureIndex is deprecated. If this line is not exists, then it throws error.
Mongoose.connect(dbUrl)

Mongoose.connection.on('open', (d) => 
{
    console.log('# --> Database connection is opened. (DB)')
})
Mongoose.connection.on("error", function(err) {
    console.log("Could not connect to mongo server!");
    return console.log(err);
});

//Service
App.listen((process.env.PORT || 5000), () => {
    console.log('# --> Service connection is opened. (App.js)')
})
App.get( '/' , (req,res) => res.send('Hello, welcome to unkownpros API service'));

//Routes
//App.use('/users' , require('./Routes/UserRoute')) 


