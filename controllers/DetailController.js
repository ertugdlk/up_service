const _ = require("lodash")
const Detail = require("up_core/models/Detail")
const Game = require("up_core/models/Game")

class DetailController {
  static async getUserGames(req, res, next) {

    try {
      const details = await Detail.find({ user: "5f96872bf30677640e4ab2cb" })
      

      res.send(details)

    }
    catch (error) {
      throw error
    }
  }

}

module.exports = DetailController