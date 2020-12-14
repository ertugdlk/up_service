const _ = require('lodash')
const {gameStatus, matchSettings, setupMatch} = require('up_core/utils/RCONutil')

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
            const result = matchSettings(req.params.roomId, req.params.teams, req.params.map)
            res.send(result)
        }
        catch(error)
        {
            throw error
        }
    }

    static async setupMatchSettings(req,res,next){
        try{
            const response = setupMatch(req.body.roomId , req.body.teams , req.body.map)
            res.send(response)
        }
        catch(error){
            throw error
        }
    }

    
}

module.exports = RconController  