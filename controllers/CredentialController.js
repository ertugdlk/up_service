const _ = require('lodash')
const Credential = require('up_core/models/UserCredentials')
const {encrypt, decrypt} = require('up_core/utils/Cryptoutil')

class CredentialController {
    static async addCredential(req,res,next) {
        try
        {
            const mappedCredential = 
            _.chain(req.body)
                .pick(['user', 'identityID', 'phone'])
                .value()

            mappedCredential.identityID = await encrypt(mappedCredential.identityID)
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