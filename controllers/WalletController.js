const Balance = require("up_core/models/Balance")
const User = require("up_core/models/User")

class WalletController {
  static async getBalance(req, res, next) {
    const user = await User.findOne({ _id: res.locals.userId })
    if (!user) {
      res.send({ status: 0, msg: "ERROR no user found" })
      res.end()
    }
    const wallet = await Balance.findOne({ user: user._id })
    if (!wallet) {
      res.send({
        status: 0,
        msg: "No wallet found with the given user information.",
      })
    }

    res.send({ balance: wallet.balance, msg: "Success wallet balance." })
  }
}

module.exports = WalletController
