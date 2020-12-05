const _ = require('lodash')
const Redis = require('redis')
const User = require('up_core/models/User')
import { response } from 'express'
import { findOne } from 'up_core/models/User'
import { sendOtp, verifyOtp } from 'up_core/utils/emailVerification'

class AuthController {
    static async createUser(req, res, next) {
        try {
            const mappedUser =
                _.chain(req.body)
                    .pick(['nickname', 'email', 'password'])
                    .value()

            const nicknameCheck = await User.findOne({ nickname: mappedUser.nickname })
            const emailCheck = await User.findOne({ email: mappedUser.email })

            if (nicknameCheck) {
                return res.status(203).send({ status: 0, msg: 'Exist User Nickname' })
            }
            else if (emailCheck) {
                return res.status(203).send({ status: 0, msg: 'Exist User Email' })
            }

            const user = await new User(mappedUser)
            await user.save()

            return res.send(user)
        }
        catch (error) {
            throw error
        }
    }

    static async sendOTP(req, res, nrext) {
        try {
            if (req.body.email) {
                const otp = await sendOtp(req.body.email)
            } else {
                return ({ "msg": "Enter an email", "status": "0" })
            }
        } catch (error) {
            throw error
        }
    }

    static async verifyOTP(email, otp) {
        try {
            verifyOtp(email, otp, (err, data) => {
                const result = data.status
                if (result != 1) {
                    return ({ "msg": "Wrong or old OTP", "status": "0" })
                } else {
                    const update = { emailVerified: true };
                    const user = await findOneAndUpdate({ emai: email }, update)
                    return response(true)
                }
            })

        } catch (error) {
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

            if (!user) {
                return res.send({ err: "user not found" })
            }

            if (!user.findByCredentials(mappedCredentials.password)) {
                throw new error({ error: 'Invalid Login Credentials' })
            }

            const token = await user.generateAuthToken()
            res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 6 * 604800 });
            res.send('success')
        }
        catch (error) {
            throw error
        }
    }

    static async logoutUser(req, res, next) {
        try {
            res.cookie('token', '', { maxAge: 0 })
            res.end()
        }
        catch (error) {
            throw error
        }
    }

    static async getUserInfo(req, res, next) {
        try {
            res.send(res.locals.user)
        }
        catch (error) {
            throw error
        }
    }
}

module.exports = AuthController