const _ = require('lodash')
const Redis = require('redis')
const User = require('up_core/models/User')

class AuthController {
    static async createUser(req, res, next) {
        try {
            const mappedUser =
                _.chain(req.body)
                    .pick(['nickname', 'email', 'password'])
                    .value()

            const nicknameCheck = await User.findOne({ nickname: mappedUser.nickname })
            const emailCheck = await User.findOne({email = mappedUser.email})

            if(nicknameCheck)
            {
                return res.status(203).send({status: 0 , msg: 'Exist User Nickname'})
            }
            else if(emailCheck)
            {
                return res.status(203).send({status: 0 , msg: 'Exist User Email'})
            }

            const user = await new User(mappedUser)
            await user.save()

            return res.send(user)
        }
        catch (error) {
            throw error
        }
    }

    static async authenticateUser(req, res, next) {
        try {
            const mappedCredentials =
                _.chain(req.body)
                    .pick(['nickname', 'password'])
                    .value()

            const user = await User.findOne({ nickname: mappedCredentials.nickname })

            if(!user)
            {
                return res.send({err:"user not found"})
            }

            if (!user.findByCredentials(mappedCredentials.password)) {
                throw new error({ error: 'Invalid Login Credentials' })
            }

            const token = await user.generateAuthToken()
            res.cookie('token', token, { httpOnly: true });
            res.send('Success')
        }
        catch (error) {
            throw error
        }
    }

    static async getUserInfo(req, res, nrext) {
        try {
            res.send(res.locals.user)
        }
        catch (error) {
            throw error
        }
    }
}

module.exports = AuthController