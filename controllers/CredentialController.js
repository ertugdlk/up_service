const _ = require('lodash')
const Credential = require('up_core/models/UserCredentials')
const {encrypt, decrypt} = require('up_core/utils/Cryptoutil')
const User = require('up_core/models/User')
const Soap = require('soap')
const easy_soap = require('easysoap')
const Config = require('config')

class CredentialController {
    static async addCredential(req,res,next) {
        try
        {
            const mappedCredential = 
            _.chain(req.body)
                .pick(['user','identityID', 'phone', 'name', 'surname', 'dateOfBirth'])
                .value()
            
            
            //Date Format
            const splittedDate = mappedCredential.dateOfBirth.split('-')
            const date = new Date()
            date.setFullYear(splittedDate[2],splittedDate[1]-1,splittedDate[0])
            mappedCredential.dateOfBirth = date

            const args={
                'TCKimlikNo' : mappedCredential.identityID,
                'Ad' : mappedCredential.name,
                'Soyad' : mappedCredential.surname,
                'DogumYili' : date.getFullYear
            }

            const result = await identity(args)

            if(result)
            {
                if(res.locals.result.TCKimlikNoDogrulaResult == true){
                    mappedCredential.user = res.locals.userId
                    mappedCredential.identityID = await encrypt(mappedCredential.identityID.toString())
                    const credential = await new Credential(mappedCredential)
                    await credential.save()

                    res.send({"status": "success","Credential": credential , "TCKN": response.TCKimlikNoDogrulaResult})
                }
                else
                {
                    res.send({"status": "failed", "msg": "TCKN and Credential information not match "})
                }
            }
            else
            {
                res.send({msg:'no response'})
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

const identity = async (args) => {

    const params = {
        host: 'tckimlik.nvi.gov.tr',
        path: '/Service/KPSPublic.asmx',
        wsdl: "/Service/KPSPublic.asmx?WSDL",
        headers: [{
            name : "SOAPAction",
            value : "http://tckimlik.nvi.gov.tr/WS/TCKimlikNoDogrula",
            }]
    }

    var client = easy_soap(params, {secure:true})

    const response = await client.call({'method' : 'TCKimlikNoDogrula',
        attributes: {
            'xmlns': 'http://tckimlik.nvi.gov.tr/WS'
        },
        params : {
            'TCKimlikNo' : args.TCKimlikNo,
            'Ad' : args.Ad,
            'Soyad' : args.Soyad,
            'DogumYili' : 1997
        }
    })

    return response
}


module.exports = CredentialController