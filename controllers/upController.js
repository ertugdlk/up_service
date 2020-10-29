const Game = require('up_core/models/Game')
const Platform = require('up_core/models/Platform')
const _ = require('lodash')

class UpController
{
    static async seedMongo(req,res,next)
    {
        try
        {
            const platform = new Platform({name:"Steam"})
            const savedPlatform = await platform.save()
            const game = new Game({platform: savedPlatform._id , name:"CSGO", appID:"730"})
            await game.save()

            res.send('success')
        }
        catch(error)
        {
            throw error
        }
    }
}

module.exports = UpController



