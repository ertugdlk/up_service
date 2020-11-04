const _ = require("lodash")
const Detail = require("up_core/models/Detail")
const Game = require("up_core/models/Game")

class DetailController {
  static async getUserGames(req, res, next) {

    try {
      const Details = await Detail.find({ user: res.locals.userId })
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