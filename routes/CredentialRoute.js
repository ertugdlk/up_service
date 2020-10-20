const Controller = require('../controllers/CredentialController')
const Authentication = require('../middlewares/AuthenticationValidation')

const router = require('express').Router()

//Routes
router.post('/add', Controller.addCredential)
router.get('/find',
    Authentication.isJWTVerified,
        Controller.getCredential)

module.exports = router