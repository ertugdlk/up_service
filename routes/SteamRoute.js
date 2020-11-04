const router = require('express').Router()
const Controller = require('../controllers/SteamController')
const Authentication = require('../middlewares/AuthenticationValidation')
const SteamMiddleware = require('../middlewares/SteamMiddleware')

//Routes
router.get('/redirect',
    Controller.getSteamID)

router.post('/getgames',
    Authentication.isJWTVerified,
        SteamMiddleware.VACbanControl,
            Controller.getSteamGames)

module.exports = router