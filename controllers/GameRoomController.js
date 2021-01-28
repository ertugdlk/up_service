const _ = require("lodash")
const { getRoom, getRooms } = require("up_core/utils/Redisutil")
const GameRoomInfo = require("up_core/models/GameRoomInfo")
const GameRoom = require("up_core/models/GameRoom")
const Game = require("up_core/models/Game")

class GameRoomController {
  static async getRoomData(req, res, next) {
    getRoom(req.body.id, (err, data) => {
      if (err) {
        res.send(err)
      }
      res.send(data)
    })
  }

  static async getRoomsData(req, res, next) {
    try {
      const allData = await GameRoomInfo.find()
      res.send(allData)
    } catch (error) {
      throw error
    }
  }

  static async getGameRoom(req, res, next) {
    try {
      const game_room = await GameRoom.findOne({ host: req.body.host })
      res.send(game_room)
    } catch (error) {
      throw error
    }
  }

  static async getGameMaps(req, res, next) {
    try {
      const game = await Game.findOne({ name: req.body.gameName })
      if (!game) {
        res.send({ msg: "Game not found", status: 0 })
      } else {
        if (!game.maps) {
          res.send({ msg: "There are no maps for this game", status: 0 })
        } else {
          res.send({ maps: game.maps })
        }
      }
    } catch (error) {
      throw error
    }
  }
}

module.exports = GameRoomController
