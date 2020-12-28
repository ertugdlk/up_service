const controller = require('../controllers/AuthController')
const Authentication = require('../middlewares/AuthenticationValidation')

const router = require('express').Router()

// Routes
router.post('/register', controller.createUser)
router.post('/login', controller.authenticateUser)
router.get('/logout', Authentication.isJWTVerified, controller.logoutUser)
router.get('/me', Authentication.isJWTVerified, controller.getUserInfo)
router.post('/sendotp', controller.sendOTP)
router.post('/verifyotp', controller.verifyOTP)
router.post('/change', Authentication.isJWTVerified, controller.change)
router.post('/update', Authentication.isJWTVerified, controller.update)

module.exports = router

