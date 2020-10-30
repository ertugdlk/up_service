const router = require('express').Router()
const Controller = require('../controllers/SteamController')
const Authentication = require('../middlewares/AuthenticationValidation')

//Routes
router.get('/redirect',
    Controller.getSteamID)

router.post('/getgames',
    Authentication.isJWTVerified,
        Controller.getSteamGames)

module.exports = router