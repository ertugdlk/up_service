const controller = require('../controllers/GameRoomController')
const Authentication = require('../middlewares/AuthenticationValidation')

const router = require('express').Router()

router.get('/getone', controller.getRoomData)
router.get('/getall',
    Authentication.isJWTVerified,
<<<<<<< HEAD
        controller.getRoomsData)
router.post('/getdata', controller.getGameRoom)
=======
    controller.getRoomsData)
router.post('/getdata', 
    Authentication.isJWTVerified,
        controller.getGameRoom)
>>>>>>> ertug

module.exports = router