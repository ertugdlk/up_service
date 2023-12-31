const _ = require("lodash")
const Redis = require("redis")
const User = require("up_core/models/User")
const {
  sendOtp,
  verifyOtp,
  ChangeEmail,
} = require("up_core/utils/emailVerification")
const bcrypt = require("bcrypt")

class AuthController {
  static async createUser(req, res, next) {
    try {
      const mappedUser = _.chain(req.body)
        .pick(["nickname", "email", "password"])
        .value()

      const nicknameCheck = await User.findOne({
        nickname: mappedUser.nickname,
      })
      const emailCheck = await User.findOne({ email: mappedUser.email })

      if (nicknameCheck) {
        return res.status(203).send({ status: 0, msg: "Exist User Nickname" })
      } else if (emailCheck) {
        return res.status(203).send({ status: 0, msg: "Exist User Email" })
      }

      const user = await new User(mappedUser)
      await user.save()

      return res.send(user)
    } catch (error) {
      throw error
    }
  }

  static async sendOTP(req, res, nrext) {
    try {
      if (req.body.email) {
        const otp = await sendOtp(req.body.email)
        res.send({ msg: "OTP sent", status: "1" })
      } else {
        res.send({ msg: "Enter an email", status: "0" })
        res.end()
      }
    } catch (error) {
      throw error
    }
  }

  static async verifyOTP(req, res, next) {
    try {
      verifyOtp(req.body.email, req.body.otp, async (err, data) => {
        const result = data.status
        const email = req.body.email
        if (result != 1) {
          res.send({ msg: "Wrong or old OTP", status: "0" })
        } else {
          const update = { emailVerified: true }
          const user = await User.findOneAndUpdate({ email: email }, update)
          res.send({ status: 1, msg: "Verified OTP" })
          res.end()
        }
      })
    } catch (error) {
      throw error
    }
  }

  static async change(req, res, next) {
    //req = {email(uniuqe), new email(unique), }
    try {
      if (req.body.nickname) {
        const user = await User.findOne({ nickname: req.body.nickname })
        const oldEmail = user.email
        const otp = await sendOtp(oldEmail)
        res.send({ msg: "OTP sent", status: "1" })
      } else {
        res.send({ status: 0, message: "nickname is NULL" })
      }
    } catch (error) {
      throw error
    }
  }

  static async update(req, res, next) {
    try {
      verifyOtp(req.body.email, req.body.otp, async (err, data) => {
        const result = data.status
        const email = req.body.email
        if (result != 1) {
          res.send({ msg: "Wrong or old OTP", status: "0" })
        } else {
          if (req.body.type == "email") {
            const update = { email: req.body.newemail }
            const user = await User.findOneAndUpdate({ email: email }, update)
            res.send({ status: 1, msg: "Email Changed" })
            res.end()
          } else if (req.body.type == "password") {
            const newpassword = req.body.newpassword
            const saltedPw = await bcrypt.hash(newpassword, 8)
            const updatedPw = { password: saltedPw }
            await User.updateOne({ email: req.body.email }, updatedPw)
            res.send({ status: 1, msg: "Password changed" })
            res.end()
          }
        }
      })
    } catch (error) {
      throw error
    }
  }

  static async authenticateUser(req, res, next) {
    try {
      const mappedCredentials = _.chain(req.body)
        .pick(["nickname", "password"])
        .value()

      const user = await User.findOne({ nickname: mappedCredentials.nickname })
      if (!user) {
        return res.send({ err: "user not found" })
      }
      const passwordTrueFalse = await user.findByCredentials(
        mappedCredentials.password
      )
      if (passwordTrueFalse === false) {
        res.status(204).send("failed")
        res.end()
      } else {
        const token = await user.generateAuthToken()

        //cookie header settings
        res.header("credentials", "include")
        res.header("Access-Control-Allow-Credentials", true)

        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 7 * 24 * 6 * 604800,
        })
        res.end()
      }
    } catch (error) {
      throw error
    }
  }

  static async logoutUser(req, res, next) {
    try {
      res.header("credentials", "include")
      res.header("Access-Control-Allow-Credentials", true)

      res.cookie("token", "", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 1,
      })
      res.clearCookie("token")

      res.end()
    } catch (error) {
      throw error
    }
  }

  static async getUserInfo(req, res, next) {
    try {
      res.send(res.locals.user)
    } catch (error) {
      throw error
    }
  }
}

module.exports = AuthController
