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
}

module.exports = AuthController