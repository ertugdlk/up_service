const _ = require('lodash')

const Detail = require('up_core/models/Detail')

class SteamController {
    static async createSteamDetail(req,res,next)
    {
        try
        {
            const split = req.query["openid.claimed_id"].split('/')
            const steamID = split[split.length - 1]



            console.log(steamID)
        }
        catch(error)
        {
            throw error
        }
    }
}

module.exports = SteamController