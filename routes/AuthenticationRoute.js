const controller = require('../controllers/AuthController')
const Authentication = require('../middlewares/AuthenticationValidation')

const router = require('express').Router()

// Routes
router.post('/register', controller.createUser)
router.post('/login', controller.authenticateUser)
router.get('/logout' , controller.logoutUser)
router.get('/me', Authentication.isJWTVerified, controller.getUserInfo)

module.exports = router

