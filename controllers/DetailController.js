const _ = require("lodash")
const Detail = require("up_core/models/Detail")
const Game = require("up_core/models/Game")

class DetailController {
  static async getUserGames(req, res, next) {

    try {
      const Details = await Detail.find({ user: "5f96872bf30677640e4ab2cb" })
      const Games = _.map(Details, 'games')
      const AllGames = _.flattenDeep(Games)
      const result = await Game.find({
        '_id': { $in: AllGames }
      })

      res.send(result)
    }
    catch (error) {
      throw error
    }
  }

}

module.exports = DetailController