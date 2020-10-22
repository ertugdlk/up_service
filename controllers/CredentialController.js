const _ = require('lodash')
const Credential = require('up_core/models/UserCredentials')
const {encrypt, decrypt} = require('up_core/utils/Cryptoutil')
const User = require('up_core/models/User')
const soap = require('soap')

class CredentialController {
    static async addCredential(req,res,next) {
        try
        {
            const mappedCredential = 
            _.chain(req.body)
                .pick(['user','identityID', 'phone', 'name', 'surname', 'dateOfBirth'])
                .value()

            const splittedDate = mappedCredential.dateOfBirth.split('-')
            const date = new Date()
            date.setFullYear(splittedDate[2],splittedDate[1]-1,splittedDate[0])
            mappedCredential.dateOfBirth = date

            const args={
            "TCKimlikNo": mappedCredential.identityID,
            "Ad": mappedCredential.name,
            "Soyad": mappedCredential.surname,
            "DogumYili": date.getFullYear(),
            }
            
            var response = {}
            const url="https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx?WSDL"

            soap.createClient(url, function(err, client) {
                client.TCKimlikNoDogrula(args, function(err, result) {
                    response = result
                    });
            });

            if(response)
            {
                if(response.TCKimlikNoDogrulaResult == true){
                    mappedCredential.user = res.locals.userId
                    mappedCredential.identityID = await encrypt(mappedCredential.identityID.toString())

                    const credential = await new Credential(mappedCredential)
                    await credential.save()
                    await User.findOneAndUpdate({_id : res.locals.userId}, {isVerified : true})

                    res.send({"status": "success","Credential": credential , "TCKN": response.TCKimlikNoDogrulaResult})
                }
                else(response.TCKimlikNoDogrulaResult == false)
                {
                    res.send({"status": "failed", "msg": "TCKN and Credential information not match "})
                }
            }
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
            soap.createClient(res.locals.url, function(err, client) {
                client.TCKimlikNoDogrula(res.locals.args, function(err, result) {
                    res.send({"response":result})
                });
            });
        }
        catch(error)
        {
            throw error
        }
    }
}

module.exports = CredentialController