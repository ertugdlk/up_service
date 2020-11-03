const _ = require("lodash")
const Detail = require("up_core/models/Detail")
const Game = require("up_core/models/Game")


class DetailController {
  static async getUserGames(req, res, next) {

    try {
      const details = await Detail.find({ user: "5f96872bf30677640e4ab2cb" })
      let _games = []
      details.map(detail => {
        if (detail.games) {
          detail.games.map(game => {
            let game_info = Game.findById(game)
            _games.push(game_info)
          })
        }
      })
      res.status(200).send({ msg: "success", data: _games })
    }
    catch (error) {
      throw error
    }
  }
}

module.exports = DetailController