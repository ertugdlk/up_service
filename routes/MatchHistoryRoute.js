const router = require("express").Router()
const Controller = require("../controllers/MatchHistoryController")
const Authentication = require("../middlewares/AuthenticationValidation")

//Routes
router.post("/",  Controller.getMatchHistory)


module.exports = router
