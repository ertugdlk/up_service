const controller = require('../controllers/AuthController')

const router = require('express').Router()

// Routes
router.post('/register' , controller.createUser)
router.post('/login', controller.authenticateUser)
router.post('/check', controller.controlSession)

module.exports = router

