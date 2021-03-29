const Balance = require("up_core/models/Balance")
const User = require("up_core/models/User")
const Transaction = require('up_core/models/Transaction')
class TransactionController {

  static async getTransactions(req, res, next) {
    const user = await User.findOne({ _id: res.locals.userId })
    //const user = await User.findOne({nickname:req.body.nickname})
    if (!user) {
      res.send({ status: 0, msg: "ERROR no user found" })
      res.end()
    }
    const transactions = await Transaction.find({ user: user._id })
    if (!transactions) {
      res.send({
        status: 0,
        msg: "You have not made any transactions",
      })
    }

    res.send({ transactions: transactions, msg: "Your transactions.",status:1 })
  }
}

module.exports = TransactionController
