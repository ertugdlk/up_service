const _ = require("lodash")
var LocalStorage = require("node-localstorage").LocalStorage
const localStorage = new LocalStorage("./scratch")

const Detail = require("up_core/models/Detail")
const SteamAPI = require("up_core/models/steam/SteamAPI")
const SteamUserDetail = require("up_core/models/steam/SteamUserDetail")

class SteamController {
  static async getSteamID(req, res, next) {
    try {
      if (!req.query["openid.claimed_id"]) {
        res.status(502).json({ msg: failed })
      } else {
        const split = req.query["openid.claimed_id"].split("/")
        const steamID = split[split.length - 1]
        res.locals.steamId = steamID
        next()
      }
    } catch (error) {
      res.status(500).json({ msg: "failed" })
      throw error
    }
  }

  static async getSteamGames(req, res, next) {
    try {
      const steamID = res.locals.steamId
      const response = await SteamUserDetail.find({ steamID: steamID })
      const SteamDetail = new SteamUserDetail(response)

      const clearedDetail = SteamDetail.toDetail({ user: res.locals.userId })
      const userDetail = new Detail(clearedDetail.__wrapped__)

      //error over here
      const detail = await SteamUserDetail.matchGames({
        steamID: steamID,
        user: res.locals.userId,
        detail: userDetail,
      })
      if (detail == null) {
        res.redirect(process.env.FRONT_URL + "dashboard/")
        res.end()
      } else {
        await detail.save()
        res.redirect(process.env.FRONT_URL + "dashboard/" + detail.name)
      }
    } catch (error) {
      res.status(500).json({ message: "Incorrect authorization token" })
      res.redirect(process.env.FRONT_URL + "dashboard/")
      throw error
    }
  }
}

module.exports = SteamController
