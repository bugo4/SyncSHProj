const express = require("express")
const router = express.Router()

const machines = require("../controllers/machines")
const { isLoggedIn } = require("../utils/middlewares")

router.get("/", isLoggedIn, machines.getMachinesList)
router.post("/", isLoggedIn, machines.addNewMachine)
router.delete("/", isLoggedIn, machines.deleteMachine)
// Connect to a machine using websocket

module.exports = router;