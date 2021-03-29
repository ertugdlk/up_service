const controller = require("../controllers/TransactionController")
const Authentication = require("../middlewares/AuthenticationValidation")

const router = require("express").Router()

router.get("/mytransactions", controller.getTransactions)

module.exports = router
