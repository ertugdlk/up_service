const _ = require('lodash')
const soap = require('soap')
const {decrypt} = require('up_core/utils/Cryptoutil')
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
            const identity = Number(decrypt(credential.identityID))
            const year = new Date(user.dateOfBirth)

            const url="https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx?WSDL"

            const args={
                TCKimlikNo: identity,
                Ad: credential.name.toUpperCase(),
                Soyad: credential.surname.toUpperCase(),
                DogumYili: 1998
                //year.getFullYear()
            }

            await soap.createClient(url, (err, client) => 
            {
                client.TCKimlikNoDogrula(args, (err, result) => {
                    if(result)
                    {
                        res.locals.result = result.TCKimlikNoDogrulaResult
                    }
                    else
                    {
                        console.log(err)
                    }
                })
                if(err){
                    console.log(err)
                }
            })
            
            next()
        }
        catch(error)
        {
            throw error
        }
    }
}

module.exports = IdentityValidation