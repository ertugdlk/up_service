const controller = require("../controllers/GameRoomController")
const Authentication = require("../middlewares/AuthenticationValidation")

const router = require("express").Router()

router.get("/getone", controller.getRoomData)
router.get("/getall", Authentication.isJWTVerified, controller.getRoomsData)
router.post("/getdata", Authentication.isJWTVerified, controller.getGameRoom)
router.post("/getmaps", Authentication.isJWTVerified, controller.getGameMaps)
router.post(
  "/checkjoined",
  Authentication.isJWTVerified,
  controller.existRoomOrNot
)
router.post(
  "/checkblacklist",
  Authentication.isJWTVerified,
  controller.checkBlackList
)

module.exports = router
