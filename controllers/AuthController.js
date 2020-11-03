const _ = require('lodash')
const Redis = require('redis')
const User = require('up_core/models/User')

const RedisClient = Redis.createClient({host: process.env.redis_host , port: process.env.redis_port,
password: process.env.redis_password})

class AuthController {
    static async createUser(req,res,next) 
    {
        try
        {
            const mappedUser = 
            _.chain(req.body)
                .pick(['nickname', 'email', 'password'])
                .value()

            const user = await new User (mappedUser)
            await user.save()

            return res.send(user)	
        }
        catch (error)
        {
            res.status(400).send(error)
            next(error)
        }
    }
    
    static async authenticateUser(req, res, next)
    {
        try
        {
            const mappedCredentials =
            _.chain(req.body)
                .pick(['nickname', 'password'])
                .value()

            const user = await User.findOne({ nickname: mappedCredentials.nickname})         

            if(!user)
            {
                    throw new error ({error: 'Invalid Login Credentials'})
            }

            if(!user.findByCredentials(mappedCredentials.password))
            {
                throw new error ({error: 'Invalid Login Credentials'})
            }

            const token = await user.generateAuthToken()
            req.session.data = token

            res.send({user,token:token , cookie: req.session.id})
        }
        catch(error)
        {
            throw error
        }
    }

    static async controlSession(req,res,next)
    {
        try
        {
            const id = req.body.cookie

            RedisClient.GET('sess:'+ id, (err,result) => {
                if(err)
                {
                    res.send(err)
                }
                else
                {
                    res.send(result)
                }
            })
        }
        catch(error)
        {
            throw error
        }
    }
}

module.exports = AuthController