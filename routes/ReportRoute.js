const controller = require("../controllers/ReportController")
const Authentication = require("../middlewares/AuthenticationValidation")

const router = require("express").Router()

router.post('/reportuser', controller.reportUser)//add is jwtverified

module.exports = router