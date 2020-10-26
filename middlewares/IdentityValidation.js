const _ = require('lodash')
const {decrypt} = require('up_core/utils/Cryptoutil')
const Credential = require('up_core/models/UserCredentials')
const User = require('up_core/models/User')
const easy_soap = require('easysoap')

class IdentityValidation 
{
    static async isIdentityIDtrue(req,res,next)
    {
        try
        {
            const url="https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx?WSDL"

            const splittedDate = req.body.dateOfBirth.split('-')
            const date = new Date()
            date.setFullYear(splittedDate[2],splittedDate[1]-1,splittedDate[0])
            /*
            //TCKN soap req args
            const args={
                "TCKimlikNo": req.body.identityID,
                "Ad": req.body.name,
                "Soyad": req.body.surname,
                "DogumYili": date.getFullYear(),
            }
            */

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

            client.call({'method' : 'TCKimlikNoDogrula',
                attributes: {
                    'xmlns': 'http://tckimlik.nvi.gov.tr/WS'
                },
                params : {
                    'TCKimlikNo' : 33640009454,
                    'Ad' : "ERTUĞ",
                    'Soyad' : "DİLEK",
                    'DogumYili' : 1998
                }
            }).then(async function (response) {
                    res.locals.result = await response.data.TCKimlikNoDogrulaResponse.TCKimlikNoDogrulaResult
                })
                .catch(function (err) {
                    console.log(err)
                })
            
            /*
            Soap.createClient(url, function(err, client) {
                client.TCKimlikNoDogrula(args, function(err, result) {
                    res.locals.response = result
                    });
            });
            */

            next()
        }
        catch(error)
        {
            throw error
        }
    }
}

module.exports = IdentityValidation