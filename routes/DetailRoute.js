const router = require("express").Router()
const Controller = require("../controllers/DetailController")
const Authentication = require("../middlewares/AuthenticationValidation")

//Routes
router.get('/games',
    Authentication.isJWTVerified,
        Controller.getUserGames)

router.post('/setign',
    Authentication.isJWTVerified,
        Controller.setIgn)

router.get('/allgames',
    Authentication.isJWTVerified,
        Controller.getAllIntegratedGames
)

router.get('/info',
    Authentication.isJWTVerified,
        Controller.getUserGames
)

module.exports = router


