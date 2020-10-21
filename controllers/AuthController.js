const _ = require('lodash')

const User = require('up_core/models/User')

class AuthController {
    static async createUser(req,res,next) 
    {
        try
        {
            const mappedUser = 
            _.chain(req.body)
                .pick(['nickname', 'email', 'password', "dateOfBirth"])
                .value()
            
            const splittedDate = mappedUser.dateOfBirth.split('-')
            const date = new Date()
            date.setFullYear(splittedDate[2],splittedDate[1]-1,splittedDate[0])
            date.setTime(0)
            mappedUser.dateOfBirth = date

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

            res.send({user,token:token})
        }
        catch(error)
        {
            throw error
        }
    }
}

module.exports = AuthController