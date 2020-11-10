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

            const user = await new User(mappedUser)
            await user.save()

            return res.send(user)
        }
        catch (error) {
            res.status(400).send(error)
            next(error)
        }
    }

    static async authenticateUser(req, res, next) {
        try {
            const mappedCredentials =
                _.chain(req.body)
                    .pick(['nickname', 'password'])
                    .value()

            const user = await User.findOne({ nickname: mappedCredentials.nickname })

            if (!user) {
                throw new error({ error: 'Invalid Login Credentials' })
            }

            if (!user.findByCredentials(mappedCredentials.password)) {
                throw new error({ error: 'Invalid Login Credentials' })
            }

            const token = await user.generateAuthToken()
            res.cookie('token', token, { httpOnly: true });

            res.send({ token: token })
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