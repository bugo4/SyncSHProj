module.exports = {
    Codes: {
        INVALID_OP: -1,
        Request: {
            CONNECT_TO_SERVER: 0,
            GET_LOGGED_PLAYERS_IN_MACHINE: 10,
            SEND_COMMAND: 20
        },
        Response: {
            CONNECT_TO_SERVER_SUCCEED: 100,
            CONNECT_TO_SERVER_FAIL: 101,
            GET_PLAYERS_SUCCEED: 110,
            GET_PLAYERS_FAIL: 111,
        },
    },
    sendLoggedPlayersInMachine: function(ws, loggedPlayers) {
        // this.sendWSMessage(ws, 10,
            //  loggedPlayers)
        if (!ws) return;
        ws.send(JSON.stringify({op: 10, d: loggedPlayers}))

    },
    sendNewMachineCommand: function(ws, newCommand, sentClient) {
        // this.sendWSMessage(ws, 10,
            //  loggedPlayers)
        if (!ws) return;
        ws.send(JSON.stringify({op: 20, d: {newCommand, sentClient}}))

    },
    sendWSMessage: function (ws, code, message) {
        ws.send(JSON.stringify({op: code, d: message}))
    },
    
};
