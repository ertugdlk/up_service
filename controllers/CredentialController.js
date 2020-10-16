const _ = require('lodash')
const Credential = require('up_core/models/UserCredentials')

class CredentialController {
    static async createCredential(req,res,next) {
        try
        {
            const mappedCredential = 
            _.chain(req.body)
                .pick(['user', 'identityId', 'phone', 'country'])
                .value()
            
            const credential = await new Credential(mappedCredential)
            await credential.save()

            res.send(credential)
        }
        catch(error)
        {
            next(error)
            res.status(400).send(error)
        }        
    }
}

module.exports = CredentialController