const _ = require('lodash')
const {gameStatus} = require('up_core/utils/RCONutil')

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
}

module.exports = RconController