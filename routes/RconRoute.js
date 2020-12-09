const controller = require('../controllers/RconController')
const router = require('express').Router()

router.get('/status' ,controller.status)

module.exports = router