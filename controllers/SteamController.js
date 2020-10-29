const _ = require('lodash')

const Detail = require('up_core/models/Detail')
const SteamAPI = require('up_core/models/steam/SteamAPI')
const SteamUserDetail = require('up_core/models/steam/SteamUserDetail')

class SteamController {
    static async createSteamDetail(req,res,next)
    {
        try
        {
            const split = req.query["openid.claimed_id"].split('/')
            const steamID = split[split.length - 1]

            const SteamDetail = await SteamUserDetail.find(steamID)
            const clearedDetail = SteamDetail.toDetail()
            const userDetail = new Detail(clearedDetail)
            await userDetail.save()
            
        }
        catch(error)
        {
            throw error
        }
    }

    static async getSteamGames(req,res,next)
    {
        try
        {

        }
        catch(error)
        {
            throw error
        }
    }
}

module.exports = SteamController