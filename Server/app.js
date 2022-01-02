if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


const ListeningPort = process.env.LISTENING_PORT || 3000
const MongoDBUrl = process.env.MONGODB_URL || "mongodb://localhost:27017/syncsh"

const session = require("express-session")
const MongoStore = require('connect-mongo');

const mongoose = require("mongoose")
const UserModel = require("./models/user")


const express = require("express")
const app = express()
const expressWs = require("express-ws")(app)

const flash = require("connect-flash")

const passport = require("passport")
const LocalStrategy = require("passport-local") // Save locally

const authenticationRouter = require("./routes/authentication")
const machinesRouter = require("./routes/machines")
const sshClientRouter = require("./routes/sshClient")

console.log(MongoDBUrl)
mongoose.connect(MongoDBUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connnection error:"));
db.once("open", () => {
    console.log("Connected into the mongo database!")
})


const MILI_IN_SECONDS = 1000
const SECONDS_IN_MIN = 60
const MIN_IN_HOURS = 60
const HOURS_IN_DAY = 24
const DAYS_IN_WEEK = 7
const DAYS_IN_MONTH = 30
const MILI_IN_MONTH = MILI_IN_SECONDS * SECONDS_IN_MIN * HOURS_IN_DAY * DAYS_IN_WEEK * DAYS_IN_MONTH

const store = MongoStore.create({
    mongoUrl: MongoDBUrl,
    secret: process.env.MONGODB_STORE_SECRET || "mongodbsecretpass",
    touchAfter: SECONDS_IN_MIN * MIN_IN_HOURS * HOURS_IN_DAY
})

store.on("error", err => {
    console.log("Error occurred on connecting to mongodb store", err)
})

const sessionConfig = {
    store,
    secret: process.env.SESSION_SECRET || "asecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + MILI_IN_MONTH,
        maxAge: MILI_IN_MONTH
    }
}

app.use(express.json())

app.use(session(sessionConfig))

app.use(passport.initialize())
app.use(passport.session()) // For persistent login interface.
passport.use(new LocalStrategy(UserModel.authenticate()))

// Store and unstore in session
passport.serializeUser(UserModel.serializeUser())
passport.deserializeUser(UserModel.deserializeUser())

app.use(flash())
app.use('/', authenticationRouter)
app.use('/ssh/servers', machinesRouter)
app.use('/ssh/client', sshClientRouter)

app.get("/", (req, res) => {
    res.send("Hello there :)")
})



app.listen(ListeningPort, () => {
    console.log(`Serving on port ${ListeningPort}`)
})