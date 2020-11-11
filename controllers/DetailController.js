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

  static async setIgn(req, res, next) {
    try {
      const Ign =
        _.chain(req.body)
          .pick(['ign'])
          .value()

      const gameId =
        _.chain(req.body)
          .pick(['appID'])
          .value()
      const Details = await Detail.find({ user: res.locals.userId })
      _games = Details.games
      const filter = { id: gameId }
      const update = { ign: Ign }
      const _game = await _games.findOneAndUpdate(filter, update)
      //const _game = await Detail.find({ ObjectId: gameId })
      //_game.set({ ign: Ign })
      await _game.save()
    }
    catch (error) {
      throw error
    }
  }
}

module.exports = DetailController