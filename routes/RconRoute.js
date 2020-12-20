const controller = require('../controllers/RconController')
const router = require('express').Router()

router.get('/status' ,controller.status)
router.get('/matchconfig', controller.loadMatchSettings)
router.post('/setupmatch' , controller.setupMatchSettings)
router.post('/startmatch' , controller.createMatch)

module.exports = router