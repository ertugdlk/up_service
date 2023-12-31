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

router.get(
  "/getwaiting",
  Authentication.isJWTVerified,
  controller.getWaitingRooms
)
router.get(
  "/getingame",
  Authentication.isJWTVerified,
  controller.getPlayingRooms
)

router.get(
  "/getwaitingfree",
  Authentication.isJWTVerified,
  controller.getFreeWaitingRooms
)

router.get(
  "/getwaitingpaid",
  Authentication.isJWTVerified,
  controller.getPaidWaitingRooms
)

router.post(
  "/setlastmap",
  Authentication.isJWTVerified,
  controller.setLastMap
)
module.exports = router
