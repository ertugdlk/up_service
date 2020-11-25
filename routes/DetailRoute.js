const router = require("express").Router()
const Controller = require("../controllers/DetailController")
const Authentication = require("../middlewares/AuthenticationValidation")

//Routes
router.get('/games',
    Controller.getUserGames)

router.post('/setign',
    Authentication.isJWTVerified,
    Controller.setIgn)

router.get('/allgames',
    Controller.getAllIntegratedGames
)

module.exports = router


