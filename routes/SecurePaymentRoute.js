const router = require("express").Router()
const Controller = require("../controllers/Pay3DController")
const Authentication = require("../middlewares/AuthenticationValidation")

//Routes
router.post("/3Dparams",  Controller.get3Dparams)


module.exports = router
