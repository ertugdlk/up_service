const router = require('express').Router()
const controller = require('../controllers/upController')

//ROUTES
router.get('/init', 
    controller.seedMongo)

module.exports = router