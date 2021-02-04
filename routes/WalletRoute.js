const controller = require("../controllers/WalletController")
const Authentication = require("../middlewares/AuthenticationValidation")

const router = require("express").Router()

router.get("/getbalance", controller.getBalance)//add is jwt verified after testing

module.exports = router