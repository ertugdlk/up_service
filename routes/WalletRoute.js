const controller = require("../controllers/WalletController")
const Authentication = require("../middlewares/AuthenticationValidation")

const router = require("express").Router()

router.get("/getbalance", Authentication.isJWTVerified, controller.getBalance)

module.exports = router
