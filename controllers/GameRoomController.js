const _ = require("lodash")
const { getRoom, getRooms } = require("up_core/utils/Redisutil")
const GameRoomInfo = require("up_core/models/GameRoomInfo")
const GameRoom = require("up_core/models/GameRoom")
const Game = require("up_core/models/Game")
const RoomBlackList = require("up_core/models/RoomBlackList")

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

  static async getWaitingRooms(req, res, next) {
    try {
      const waitingrooms = await GameRoom.find({ status: "waiting" })
      if (waitingrooms) {
        res.send(waitingrooms)
      } else {
        res.send({ msg: "There are currently no waiting rooms" })
      }
    } catch (error) {
      throw error
    }
  }

  static async getPlayingRooms(req, res, next) {
    try {
      const ingamerooms = await GameRoom.find({ status: "playing" })
      if (ingamerooms) {
        res.send(ingamerooms)
      } else {
        res.send({ msg: "There are currently no playing rooms" })
      }
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

  static async existRoomOrNot(req, res, next) {
    try {
      const joinedRoom = await GameRoom.findOne({
        users: { $elemMatch: { nickname: req.body.nickname } },
      })
      const hostedRoom = await GameRoom.findOne({ host: req.body.nickname })

      if (joinedRoom || hostedRoom) {
        res.send({ status: 0, msg: "Exist joined or hosted room" })
      } else {
        res.send({ status: 1, msg: "Not any joined or hosted room" })
      }
    } catch (error) {
      throw error
    }
  }

  static async checkBlackList(req, res, next) {
    try {
      const room = await GameRoom.findOne({ host: req.body.host })
      const blackList = await RoomBlackList.findOne({ room: room._id })
      const checkBlackList = _.find(blackList.users, (user) => {
        return data.nickname == user.nickname
      })

      if (checkBlackList != undefined) {
        res.send({ status: 0, msg: "User kicked from this room" })
      } else {
        res.send({ status: 1, msg: "User able to join" })
      }
    } catch (error) {
      throw error
    }
  }
}

module.exports = GameRoomController
