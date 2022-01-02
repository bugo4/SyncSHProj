const express = require("express")
const router = express.Router()

const users = require("../controllers/authentication")

console.log(users)

const passport = require("passport")
const LocalStrategy = require("passport-local") // Save locally

const {isLoggedIn, isNotLoggedIn} = require("../utils/middlewares") 

// Authorization
router.post("/login", isNotLoggedIn, passport.authenticate('local') , users.loginUser)

router.post("/register", users.registerUser)

router.get("/logout", isLoggedIn, users.logoutUser)

router.get("/isLoggedIn", isLoggedIn, users.handleIsLoggedIn)

module.exports = router;