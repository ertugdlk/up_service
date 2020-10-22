const _ = require('lodash')
const {decrypt} = require('up_core/utils/Cryptoutil')
const Credential = require('up_core/models/UserCredentials')
const User = require('up_core/models/User')

class IdentityValidation 
{
    static async isIdentityIDtrue(req,res,next)
    {
        try
        {
            const url="https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx?WSDL"
            res.locals.url = url
            next()
        }
        catch(error)
        {
            throw error
        }
    }
}

module.exports = IdentityValidation