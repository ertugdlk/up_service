const controller = require('../controllers/GameRoomController')
const Authentication = require('../middlewares/AuthenticationValidation')

const router = require('express').Router()

router.get('/getone', controller.getRoomData)
router.get('/getall',
    Authentication.isJWTVerified,
    controller.getRoomsData)
router.post('/getroominfo', controller.getRoomInfo)

module.exports = router