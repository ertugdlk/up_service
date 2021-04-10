const Express = require("express")
const BodyParser = require("body-parser")
const Config = require("config")
const Cors = require("cors")
const Mongoose = require("mongoose")
const Helmet = require("helmet")
const passport = require("up_core/passport/setup")
const Cookie = require("cookie-parser")
const Websockets = require("up_core/utils/Websockets")
const Https = require("https")
const http = require("http")
const fs = require("fs")
const amqp = require("amqplib")

//DATABASE
Mongoose.set("useFindAndModify", false) // FindAndModify method is deprecated. If this line is not exists, then it throws error.
Mongoose.set("useCreateIndex", true) // ensureIndex is deprecated. If this line is not exists, then it throws error.
Mongoose.connect(Config.get("database.url"), { useNewUrlParser: true })

Mongoose.connection.on("open", (d) => {
  console.log("# --> Database connection is opened. (Server)")
})
Mongoose.connection.on("error", function (err) {
  console.log("Could not connect to mongo server!")
  return console.log(err)
})

//CORS Settings
const whitelist = [
  "https://ertug-2.d4u99xidnqjcw.amplifyapp.com",
  "http://localhost:3000",
  "https://beta.unknownpros.com/",
]
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(null, false)
    }
  },
  credentials: true,
}

const App = Express()

App.use(passport.initialize())
App.use(Helmet())
App.use(BodyParser.json())
App.use(BodyParser.urlencoded({ extended: true }))
App.use(Cors(corsOptions))
App.use(function (req, res, next) {
  res.set("credentials", "include")
  res.set("Access-Control-Allow-Credentials", true)
  next()
})
App.use(Cookie())

var server

if (process.env.BASE_URL == "http://localhost:5000/") {
  server = http.createServer(App)
} else {
  const options = {
    key: fs.readFileSync("../server.key", "utf8"),
    cert: fs.readFileSync("../server.crt", "utf8"),
  }
  server = Https.createServer(options, App)
}

const SocketIO = require("socket.io")(server)
global.io = SocketIO
global.io.on("connection", Websockets.connection)

/*
//RabbitMQ settings
var connReady = false
var conn
const RabbitMQ = async () => {
  conn = await amqp.connect("amqp://localhost:5672")
  global.channel = await conn.createChannel()
  await global.channel.assertQueue("backOffice")
}

RabbitMQ()
*/

//Service
server.listen(5000)

App.get("/", (req, res) => {
  res.json({
    msg: "unkownpros API service",
  })
})

//Routes
App.use("/auth", require("./routes/AuthenticationRoute"))
App.use("/credential", require("./routes/CredentialRoute"))
App.use("/steam", require("./routes/SteamRoute"))
App.use("/detail", require("./routes/DetailRoute"))
App.use("/room", require("./routes/GameRoomRoute"))

App.use("/rcon", require("./routes/RconRoute"))

App.use("/wallet", require("./routes/WalletRoute"))

App.use("/report", require("./routes/ReportRoute"))
App.use("/pay", require("./routes/PaymentRoute"))
App.use("/transactions", require("./routes/TransactionRoute"))

App.use("/paysecure", require("./routes/SecurePaymentRoute"))
App.use("/matchHistories",require("./routes/MatchHistoryRoute"))

App.get(
  "/steam/auth",
  passport.authenticate("steam", { failureRedirect: "/" }),
  function (req, res) {
    res.redirect("/")
  }
)

App.get(
  "/steam/return",
  passport.authenticate("steam", { failureRedirect: "/" }),
  function (req, res) {
    res.redirect("localhost:3000/dashboard")
  }
)

App.get(
  "/success",
  function (req, res) {
    res.send("success")
  }
)
