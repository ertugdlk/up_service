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

            const user = await JWTutil.verify(accessToken, jwtOptions)

            if(user)
            {
                res.locals.userId = user._id

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