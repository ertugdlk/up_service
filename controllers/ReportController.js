const Ticket = require("up_core/models/Ticket")

class ReportController {
  static async reportUser(req, res, next) {
    try {
      const reporter = req.body.reporter
      const reported = req.body.reported
      const room_id = req.body.room_id
      let reportType = []
      let message = ""

      if (req.body.reportType) {
        reportType = req.body.reportType
      }
      if (req.body.message) {
        message = req.body.message
      }
      //ticket info
      const ticketInfo = {
        reporter: reporter,
        reported: reported,
        room_id: room_id,
        reportType: reportType,
        message: message,
      }
      const ticket = new Ticket(ticketInfo)
      await ticket.save()

      global.channel.sendToQueue(
        "backOffice",
        Buffer.from(JSON.stringify({ message: "new_ticket", data: ticketInfo }))
      )

      res.send({ msg: "Ticket sent successfully!", status: 1 })
      res.end()
    } catch (error) {
      throw error
    }
  }
}

module.exports = ReportController
