const _ = require('lodash')
const Config = require('config')
const JWTutil = require('up_core/utils/JWTutil')
const Boom = require('@hapi/boom')

class AuthenticationValidation
{
    static async isJWTVerified(req, res, next)
    {
        try
        {
            const jwtOptions = Config.get('jwt')
            const accessToken = JWTutil.getAccessToken(req)
            console.log(accessToken)
            //yukarıdaki getaccesstoken a aktar bunu
            if(!accessToken){
                res.send(Boom.unauthorized('Access token is invalid'))
                res.end()
            }
            console.log(jwtOptions)
            const user = await JWTutil.verify(accessToken, jwtOptions)

            if(user)
            {
                res.locals.userId = user._id
                res.locals.user = user

                next()
            }
            else
            {
                Boom.unauthorized('Access token is invalid')
            }

        }
        catch(error)
        {
            next(Boom.conflict('No permission to access'))
        }
    }
}

module.exports = AuthenticationValidation