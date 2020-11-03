const _ = require("lodash")
const Detail = require("up_core/models/Detail")
const Game = require("up_core/models/Game")

async function findGameInfo(id) {
  const info = await Game.findById(id)
  return info
}

class DetailController {
  static async getUserGames(req, res, next) {

    try {
      const details = await Detail.find({ user: "5f96872bf30677640e4ab2cb" })
      const result= []
      const gamesAll = []
      const infos = []

      await details.map( detail => {
        if(detail){
          const games = _.chain(detail).get('games').value()
          result.push(games)
      }
      })

      await result.map(gameArray => {
        gameArray.map( game => {
          gamesAll.push(game)
        })
      })

      res.send()

    }
    catch (error) {
      throw error
    }
  }

}

module.exports = DetailController