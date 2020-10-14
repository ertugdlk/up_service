const controller = require('../controllers/AuthController')

const router = require('express').Router()

// Routes
router.post('/register' , controller.createUser)
router.post('/login', controller.authenticateUser)

module.exports = router

