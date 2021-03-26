const router = require("express").Router()
const Controller = require("../controllers/Pay2DController")
const Authentication = require("../middlewares/AuthenticationValidation")

//Routes
router.post("/pay2d",Authentication.isJWTVerified,  Controller.paySmart2D)

module.exports = router
