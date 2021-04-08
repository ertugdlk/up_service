const User = require('up_core/models/User')
const MatchHistory = require('up_core/models/MatchHistory')


class MatchHistoryController{
    static async getMatchHistory(req, res, next){
        try {
            const nickname = req.body.nickname
            var MatchHistories = await MatchHistory.find({users:{ $elemMatch: { nickname: req.body.nickname } } })
            res.send(MatchHistories)
        } catch (error) {
            throw error
        }
        
    }
}

module.exports = MatchHistoryController