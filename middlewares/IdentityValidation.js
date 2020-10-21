const _ = require('lodash')
const soap = require('soap')
const {decrpyt} = require('up_core/utils/Cryptoutil')
const Credential = require('up_core/models/UserCredentials')
const User = require('up_core/models/User')

class IdentityValidation 
{
    static async isIdentityIDtrue(req,res,next)
    {
        try
        {
            const userId = res.locals.userId
            const credential = await Credential.findOne({user:userId})
            const user = await User.findById(userId)
            const identity = decrpyt(credential.identityID)
            const year = new Date()
            year = user.dateOfBirth

            var url="https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx?WSDL"
            var args={
                "TCKimlikNo": identity,
                "Ad": credential.name.toUpperCase(),
                "Soyad": credential.surname.toUpperCase(),
                "DogumYili": year.getFullYear()
            }

            soap.createClient(url, function(err, client) {
                client.TCKimlikNoDogrula(args, function(err, result) {
                    res.locals.status = result
                });
            });
        }
        catch(error)
        {
            throw error
        }
    }
}

module.exports = IdentityValidation