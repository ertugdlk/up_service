const _ = require('lodash')
const {getRoom , getRooms} = require('up_core/utils/Redisutil')

class GameRoomController
{
    static async getRoomData(req,res,next)
    {
        getRoom(req.body.id , (err,data) => {
            if(err)
            {
                res.send(err)
            }
            res.send(data)
        })

    }

    static async getRoomsData(req,res,next)
    {
        getRooms((err,data) => {
            if(err)
            {
                res.send(err)
            }
            res.send(data)
        })

    }
}

module.exports = GameRoomController