const controller = require("../controllers/RconController")
const AuthValidation = require("../middlewares/AuthenticationValidation")
const router = require("express").Router()

router.get("/status", controller.status)
router.get(
  "/matchconfig",
  AuthValidation.isUPserver,
  controller.loadMatchSettings
)
router.post(
  "/setupmatch",
  AuthValidation.isUPserver,
  controller.setupMatchSettings
)

module.exports = router
