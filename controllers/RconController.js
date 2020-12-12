const _ = require('lodash')
const {gameStatus, matchSettings} = require('up_core/utils/RCONutil')

class RconController{
    static async status(req,res,next){
        try{
            const result = gameStatus()
            res.send(result)
        }
        catch(error)
        {
            throw error
        }
    }

    static async loadMatchSettings(req,res,next){
        try
        {
            const result = matchSettings(req.params.roomId, req.params.teams, req.body.map)
            res.send(result)
        }
        catch(error)
        {
            throw error
        }
    }
}

module.exports = RconController  