const router = require('express').Router()
const Controller = require('../controllers/SteamController')
const Authentication = require('../middlewares/AuthenticationValidation')
const SteamMiddleware = require('../middlewares/SteamMiddleware')

//Routes
router.get('/redirect',
    Authentication.isJWTVerified,
        Controller.getSteamID,
            SteamMiddleware.VACbanControl,
                Controller.getSteamGames)

router.post('/getgames',
    Authentication.isJWTVerified,
        SteamMiddleware.VACbanControl,
            Controller.getSteamGames)

module.exports = router