const _ = require("lodash")
const Config = require("config")
const JWTutil = require("up_core/utils/JWTutil")
const Boom = require("@hapi/boom")

class AuthenticationValidation {
  static async isJWTVerified(req, res, next) {
    try {
      const jwtOptions = Config.get("jwt")
      const accessToken = JWTutil.getAccessToken(req)
      console.log(accessToken)
      //yukarıdaki getaccesstoken a aktar bunu
      if (!accessToken) {
        res.send(Boom.unauthorized("Access token is invalid"))
        res.end()
      }
      console.log(jwtOptions)
      const user = await JWTutil.verify(accessToken, jwtOptions)

      if (user) {
        res.locals.userId = user._id
        res.locals.user = user

        next()
      } else {
        Boom.unauthorized("Access token is invalid")
      }
    } catch (error) {
      next(Boom.conflict("No permission to access"))
    }
  }

  static async isUPserver(req, res, next) {
    try {
      //whitelist Settings
      const whitelist = ["176.236.134.7", "176.236.134.6"]
      const ip = req.headers["x-forwarded-for"]
      console.log(req.headers)
      console.log(req.connection.remoteAddress)

      if (whitelist.indexOf(ip) !== -1) {
        next()
      } else {
        next(Boom.conflict("No permission to access"))
      }
    } catch (error) {
      throw error
    }
  }
}

module.exports = AuthenticationValidation
