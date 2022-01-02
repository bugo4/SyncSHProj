const express = require("express");
const router = express.Router();
const UserModel = require("../models/user");
const AccountModel = require("../models/machineAccount");

const { isLoggedIn } = require("../utils/middlewares");

const sshClients = require("../controllers/sshClient");

const {Codes, sendWSMessage, sendLoggedPlayersInMachine} = require("../utils/wsProtocol")
const wsClients = new Map();
const redisClient = require('../utils/redisClient');

const sshClientInstance = require("../utils/sshClientInstance");


// SSH Client Middlewares
function isWSConnected(req, res, next) {
    const userName = req.user.username;
    if (!wsClients.get(userName)) {
        return res.json({
            type: "error",
            message: "Need to log into websocket first...",
        });
    }
    next();
}
// Long polling request
router.post("/connect", isLoggedIn, isWSConnected, async (req, res) => {
    const { accountId = null } = req.body;
    const userName = req.user.username;
    const userId = req.user._id;
    if (!accountId) return res.json({
        type: "error",
        message: "No accound was found...",
    });
    let foundUser = null
    try {
        foundUser = await UserModel.find({
            _id: userId, 
            cachedUserServers: {_id: accountId}
        }).populate('cachedUserServers');
    }
    catch {
        foundUser = null
    }
    if (!foundUser) {
        return res.json({
            type: "error",
            message: "The machine id is not correct...",
        });
    }
    const foundAccount = await AccountModel.findById(accountId).populate("serverConfiguration")
    if (!foundAccount) {
        return res.json({
            type: "error",
            message: "Account id was not found...",
        }); 
    }
    console.log("Found Account")
    console.log(foundAccount)
    try {
        const connectedToMachine = await sshClientInstance.connectSSH(accountId, foundAccount.serverConfiguration.serverIP, foundAccount.serverConfiguration.serverPort, foundAccount.name, foundAccount.password)
    } catch (e) {
        console.log(e)
        return res.json({type: "error", message: e})
    }
    // Todo: send a connection request to the ssh client on the specified accound id

    //     return res.json({
    //         type: "error",
    //         message: "Unable to connect to machine...",
    //     });
    // }
    // addPlayerToRoom(sessionId, accountId)
    console.log(req.user)
    await redisClient.sAdd(accountId, userName)
    const prevRoomName = await redisClient.get(userName)
    if (prevRoomName && prevRoomName !== accountId) {
        await redisClient.sRem(prevRoomName, userName)
        const prevRoomPlayers = await redisClient.sMembers(prevRoomName);
        for (let i = 0; i < prevRoomPlayers.length; i++) {
            sendLoggedPlayersInMachine(wsClients.get(prevRoomPlayers[i]), prevRoomPlayers)
        }
    }
    await redisClient.set(userName, accountId)
    console.log(accountId)
    // const roomPlayers = [sessionId]
    const roomPlayers = await redisClient.sMembers(accountId);
    console.log(roomPlayers)
    /**
     * Check if account exists inside redis - if so, push the client to the online users
     * If account does not exist, add the account to redis and push the online user
     */
    res.json({
        type: "success",
        message: "Successfully joined the server...",
    });
    // roomPlayers = Get all redis clients inside the chosen accountId
    // for roomPlayer in roomPlayers - send on ws the new list of online players
    for (let i = 0; i < roomPlayers.length; i++) { // Broadcast to each player in the room
        sendLoggedPlayersInMachine(wsClients.get(roomPlayers[i]), roomPlayers)
    }

    
});

router.post("/command", isLoggedIn, isWSConnected, async (req, res) => {
    const { accountId = null, command = null } = req.body;
    const userName = req.user.username;
    const userId = req.user._id;
    if (!accountId) return res.json({
        type: "error",
        message: "No accound was found...",
    });
    if (!command) return res.json({
        type: "error",
        message: "No command was found...",
    });
    let foundUser = null
    try {
        foundUser = await UserModel.find({
            _id: userId, 
            cachedUserServers: {_id: accountId}}
        );
    }
    catch {
        foundUser = null
    }
    if (!foundUser) {
        return res.json({
            type: "error",
            message: "The machine id is not correct...",
        });
    }
    // Message logic here
    function sendCommandToSshClient() {
        return true;
    }
    if (sendCommandToSshClient(command)) {
        const roomPlayers = await redisClient.sMembers(accountId);
        console.log(roomPlayers)
        /**
         * Check if account exists inside redis - if so, push the client to the online users
         * If account does not exist, add the account to redis and push the online user
         */
        res.json({
            type: "success",
            message: "Successfully sent the command...",
        });
        // roomPlayers = Get all redis clients inside the chosen accountId
        // for roomPlayer in roomPlayers - send on ws the new list of online players
        for (let i = 0; i < roomPlayers.length; i++) { // Broadcast to each player in the room
            sendNewMachineCommand(wsClients.get(roomPlayers[i]), command, userName)
        }
    } else {
        return res.json({
            type: "error",
            message: "Unable to send the command to the SSH server...",
        });
    }
})

router.ws("/", (ws, req) => {
    // wsClients.set(req.session.id, ws)
    // console.log(wsClients)
    ws.on("message", (msg) => {
        const userSession = req.session;
        if (!wsClients.get(userSession.id)) {
            return;
        }

        const chosenUser = req.user;
        console.log(chosenUser);
        console.log(userSession);
        const { op = wsProtocol.Codes.INVALID_OP, d } = JSON.parse(msg);
        switch (op) {
            case ops.CONNECT_TO_SERVER:
                console.log("Tried connecting to server");
                const { accountId } = d;
                if (!accountId) {
                    ws.send(
                        JSON.stringify({
                            type: "error",
                            message: "accountId was not entered...",
                        })
                    );
                } else {
                    if (
                        sshClients.connectToAccount(
                            chosenUser._id,
                            chosenUser.username,
                            accountId
                        )
                    ) {
                        return ws.send(
                            JSON.stringify({
                                type: "error",
                                message: "accountId was not entered...",
                            })
                        );
                    }
                    return ws.send(
                        JSON.stringify({
                            type: "error",
                            message: "accountId was not entered...",
                        })
                    );
                }
                break;
            case ops.GET_LOGGED_PLAYERS_IN_MACHINE:
                console.log("Tried getting players in machine");
                break;
            default:
                console.log("invalid op was entered...");
                break;
        }
        // console.log(req.session)
    });
    ws.on("close", async (code, reason) => {
        if (!req.user) return;
        const {username} = req.user
        const roomName = await redisClient.get(username)
        console.log(roomName)
        if (roomName) {
            await redisClient.sRem(roomName, username)
            await redisClient.del(username)
            const roomPlayers = await redisClient.sMembers(roomName);
            // Todo: Think about a faster protocol implementation - like +/-{username} and on connection - gets all the users
            for (let i = 0; i < roomPlayers.length; i++) {
                sendLoggedPlayersInMachine(wsClients.get(roomPlayers[i]), roomPlayers)
            }
        }
        wsClients.delete(username)
        console.log(wsClients)
    })
    // Todo: Check what happens if user is not logged in
    // Todo: Implement heartbeat
    if (!req.user) {
        console.log("No user, closing connection")
        ws.close()
    }
    wsClients.set(req.user.username, ws)
});

module.exports = router;
