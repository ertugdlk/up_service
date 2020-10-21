const Controller = require('../controllers/CredentialController')
const Authentication = require('../middlewares/AuthenticationValidation')
const Identity = require('../middlewares/IdentityValidation')

const router = require('express').Router()

//Routes
router.post('/add', 
    Authentication.isJWTVerified, 
        Controller.addCredential)
        
router.get('/find',
    Authentication.isJWTVerified,
        Controller.getCredential)

router.get('/checkId',
    Authentication.isJWTVerified,
        Identity.isIdentityIDtrue,
            Controller.checkIdentity)

module.exports = router