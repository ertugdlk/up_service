const _ = require('lodash')

const User = require('up_core/models/User')

class AuthController {
    static async createUser(req,res,next) 
    {
        try
        {
            const mappedUser = 
            _.chain(req.body)
                .pick(['nickname', 'name', 'surname', 'email', 'password'])
                .value()
            
            const user = await new User (mappedUser)
            await user.save()

            return res.send(user)	
        }
        catch (error)
        {
            next(error)
            res.status(400).send(error)
        }
    }
    
    static async authenticateUser(req, res, next)
    {
        try
        {
            const mappedCredentials =
            _.chain(req.body)
                .pick(['email', 'password'])
                .value()

            const user = await User.findOne({ email: mappedCredentials.email})         

            if(!user)
            {
                throw new error ({error: 'Invalid Login Credentials'})
            }

            if(!user.findByCredentials(mappedCredentials.password))
            {
                throw new error ({error: 'Invalid Login Credentials'})
            }
            
            const token = user.generateAuthToken()

            res.send({user,token})
        }
        catch(error)
        {
            throw error
        }
    }
}

module.exports = AuthController