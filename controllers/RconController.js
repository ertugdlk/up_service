const _ = require("lodash")
const {
  gameStatus,
  matchSettings,
  setupMatch,
  createMatch,
} = require("up_core/utils/RCONutil")

class RconController {
  static async status(req, res, next) {
    try {
      const result = gameStatus()
      res.send(result)
    } catch (error) {
      throw error
    }
  }

  static async loadMatchSettings(req, res, next) {
    try {
      const serverInformation = await matchSettings(req.query.host)
      res.send(serverInformation)
    } catch (error) {
      throw error
    }
  }

  static async setupMatchSettings(req, res, next) {
    try {
      const response = await setupMatch(req.body.host)
      res.send()
    } catch (error) {
      throw error
    }
  }
}

module.exports = RconController
