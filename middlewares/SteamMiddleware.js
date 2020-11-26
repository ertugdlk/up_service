const _ = require('lodash')
const SteamAPI = require('up_core/models/steam/SteamAPI')
var LocalStorage = require('node-localstorage').LocalStorage
const localStorage = new LocalStorage('./scratch')

class SteamMiddleware 
{
    static async VACbanControl(req,res,next)
    {
        try{
            const response = await SteamAPI.controlVac({steamID: res.locals.steamId})

            if(response.VACBanned == true)
            {
                res.json({status:"failed", msg:"User has vac ban, cant connect steam"})
            }
            else
            {
                next()
            }
        }
        catch(error)
        {
            throw error
        }
    }
}

module.exports = SteamMiddleware