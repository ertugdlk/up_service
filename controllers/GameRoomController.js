const _ = require('lodash')
const { getRoom, getRooms } = require('up_core/utils/Redisutil')
const GameRoomInfo = require('up_core/models/GameRoomInfo')
const GameRoom = require('up_core/models/GameRoom')

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

    static async getRoomInfo(req, res, next) {
        try {
            const gameRoomInfo = await GameRoom.findOne({ host: req.body.host })
            res.send(gameRoomInfo)
        } catch (error) {
            throw error
        }
    }
}


module.exports = GameRoomController