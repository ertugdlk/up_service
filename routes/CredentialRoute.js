const Controller = require("../controllers/CredentialController")
const Authentication = require("../middlewares/AuthenticationValidation")

const router = require("express").Router()

//Routes
router.post(
  "/add",
  Authentication.isJWTVerified,
  Controller.checkCredential,
  Controller.addCredential
)

router.get("/find", Authentication.isJWTVerified, Controller.getCredential)

module.exports = router
