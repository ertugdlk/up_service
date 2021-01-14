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
const fs = require("fs")

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

const options = {
  key: fs.readFileSync("../../../etc/pki/nginx/private/server.key", "utf8"),
  cert: fs.readFileSync("../../../etc/pki/nginx/server.crt", "utf8"),
}
const server = Https.createServer(options, App)
const SocketIO = require("socket.io")(server)
global.io = SocketIO
global.io.on("connection", Websockets.connection)

//Service
server.listen(5000)

App.get("/", (req, res) =>
  res.json({
    msg: "unkownpros API service",
  })
)

//Routes
App.use("/auth", require("./routes/AuthenticationRoute"))
App.use("/credential", require("./routes/CredentialRoute"))
App.use("/steam", require("./routes/SteamRoute"))
App.use("/detail", require("./routes/DetailRoute"))
App.use("/room", require("./routes/GameRoomRoute"))

App.use("/rcon", require("./routes/RconRoute"))

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
