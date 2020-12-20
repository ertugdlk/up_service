const _ = require('lodash')
const {gameStatus, matchSettings, setupMatch, createMatch} = require('up_core/utils/RCONutil')

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
            const result = await matchSettings(req.query.host)
            res.send(result)
        }
        catch(error)
        {
            throw error
        }
    }

    static async setupMatchSettings(req,res,next){
        try{
            const response = await setupMatch(req.body.host)
            res.send(response)
        }
        catch(error){
            throw error
        }
    }

    static async createMatch(req,res,next){
        try{
            await createMatch()
            res.status(200).send({msg:'success', ip: '213.243.44.6' })
        }
        catch(error){
            throw error
        }
    }

    
}

module.exports = RconController  