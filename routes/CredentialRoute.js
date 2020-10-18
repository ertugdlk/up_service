const Controller = require('../controllers/CredentialController')

const router = require('express').Router()

//Routes
router.post('/add', Controller.addCredential)

module.exports = router