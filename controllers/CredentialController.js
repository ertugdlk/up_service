const _ = require('lodash')
const Credential = require('up_core/models/UserCredentials')
const {encrypt, decrypt} = require('up_core/utils/Cryptoutil')
const User = require('up_core/models/User')

class CredentialController {
    static async addCredential(req,res,next) {
        try
        {
            const mappedCredential = 
            _.chain(req.body)
                .pick(['user','identityID', 'phone', 'name', 'surname'])
                .value()

            mappedCredential.user = res.locals.userId
            mappedCredential.identityID = await encrypt(mappedCredential.identityID)

            const credential = await new Credential(mappedCredential)
            await credential.save()
            await User.findOneAndUpdate({_id : res.locals.userId}, {isVerified : true})

            res.send(credential)
        }
        catch(error)
        {
            throw error
        }        
    }

    static async getCredential(req,res,next) {
        try
        {
            const credentialOfUser = await Credential.findOne({user: res.locals.userId})
            const identity = await decrypt(credentialOfUser.identityID)

            res.send({msg:"Success", credential:credentialOfUser, identity:identity})
        }
        catch(error)
        {
            throw error
        }
    }

    static async checkIdentity(req,res,next) {
        try
        {
            const result = res.locals.result
            
            res.send(result)
        }
        catch(error)
        {
            throw error
        }
    }
}

module.exports = CredentialController