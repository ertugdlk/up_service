const _ = require('lodash')
const { getRoom, getRooms } = require('up_core/utils/Redisutil')
const GameRoomInfo = require('up_core/models/GameRoomInfo')

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
}


module.exports = GameRoomController