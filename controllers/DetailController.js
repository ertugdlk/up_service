const _ = require("lodash")
const Detail = require("up_core/models/Detail")
const Game = require("up_core/models/Game")

class DetailController {
  static async getUserGames(req, res, next) {

    try {
      const Details = await Detail.find({ user: res.locals.userId })
      const Games = _.map(Details, 'games')
      const AllGames = _.flattenDeep(Games)
      var newArray = []
      _.forEach(AllGames, function(doc){
        newArray.push(doc.id)
      })
      const result = await Game.find({
        '_id': { $in: newArray }
      })

      res.send(result)
    }
    catch (error) {
      throw error
    }
  }

  static async getUserDetail(req,res,next) {
    try{
      const detail = await Detail.findOne({user: res.locals.userId})
      if(!detail){
        res.send('')
        next()
      }
      res.send(detail.name)
    }
    catch(error){
      throw error
    }
  }

  static async setIgn(req, res, next) {
    try {

      const mappedInfo =
        _.chain(req.body)
          .pick(['ign', 'appId'])
          .value()

      const updatedDetail = await Detail.findOneAndUpdate({ user: res.locals.userId, 'games.id': mappedInfo.appId },
        { 'games.$.ign': mappedInfo.ign })

      if (!updatedDetail) {
        res.send({ 'status': 0, 'msg': 'error' })
      }

      res.send({ 'status': 1, 'msg': 'success' })
    }
    catch (error) {
      throw error
    }
  }

  static async getAllIntegratedGames(req, res, next) {
    try {
      const games = await Game.find()
      res.send(games)

    } catch (error) {
      throw error
    }

  }
}

module.exports = DetailController