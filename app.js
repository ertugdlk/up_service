const Express = require('express')
const BodyParser = require('body-parser')
const Config     = require('config')
const Cors = require('cors')

const App = Express()

App.use(BodyParser.json())
App.use(BodyParser.urlencoded({ extended: true }))
App.use(Cors())

console.log('# --> Port:', Config.port())

App.listen(Config.port())

