const _ = require('lodash')
var LocalStorage = require('node-localstorage').LocalStorage
const localStorage = new LocalStorage('./scratch')

const Detail = require('up_core/models/Detail')
const SteamAPI = require('up_core/models/steam/SteamAPI')
const SteamUserDetail = require('up_core/models/steam/SteamUserDetail')

class SteamController {
    static async createSteamDetail(req,res,next)
    {
        try
        {
            if(!req.query["openid.claimed_id"])
            {
                res.send("failed")
            }
            else
            {
                const split = req.query["openid.claimed_id"].split('/')
                const steamID = split[split.length - 1]
                localStorage.setItem("steam", steamID)

                res.send('success')
            }
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
            const steamID = localStorage.getItem("steam")                
            const response = await SteamUserDetail.find({steamID : steamID})
            localStorage.removeItem('steam')
            const SteamDetail = new SteamUserDetail(response)

            const clearedDetail = SteamDetail.toDetail({user : res.locals.userId})
            const userDetail = new Detail(clearedDetail.__wrapped__)
            await userDetail.save()
            

            const detail = await SteamUserDetail.matchGames({steamID: steamID, user: res.locals.userId})
            const SavedDetail = await detail.save()
            
            res.send(SavedDetail)
        }
        catch(error)
        {
            throw error
        }
    }
}

module.exports = SteamController