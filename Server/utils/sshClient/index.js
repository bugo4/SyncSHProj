const net = require("net");
var events = require("events");
const commands = require("./commands.json")

class SSHClient {
    /**
     * 
     * @param {String} ip 
     * @param {Number} port 
     */
    constructor(ip="127.0.0.1", port=12346) {
        this.hasConnected = false;
        this.client = new net.Socket();
        this.ip = ip;
        this.port = port;

        this.serviceEvent = new events.EventEmitter();
    }
    /**
     * This method connects to the SSH Client microservice.
     */
    connect() {
        return new Promise((resolve, reject) => {
            this.client.connect(this.port, this.ip, () => {
                console.log("(SSHClient) Connected to the microservice");
                this.hasConnected = true;
                this.#handleRecvMessages();
                resolve();
            });
        })
    }
    /**
     * This function handles messages recievement.
     * @param {String} ip microservice ip
     * @param {Number} port microservice port
     */
    async #handleRecvMessages() {
        
        this.client.on("data", (data) => {
            console.log("Received: " + data);
            try {
                const serverResponse = JSON.parse(data);
                console.log(serverResponse)
                this.serviceEvent.emit(serverResponse.type, serverResponse.d)
            } catch (e) {
                console.log(e)
            }
            // Todo: recv handling
            // this.serviceEvent.emit("sshConnection", "")
        });
        this.client.on("close", () => {
            console.log("Connection closed");
            this.client.destroy(); // kill client after server's response
            this.hasConnected = false;
        });
    }
    /**
     * 
     * @param {String} type Message type - Connect, Send Command
     * @param {Object} data the payload of the message to send the the SSH Client microservice.
     * @returns {String} stringified json that contains the type and data inside.
     */
    #convertMessageToString(type, data) {
        return JSON.stringify({type, d: data})
    }
    /**
     * @throws {Error}
     * @param {String} message message to send to the SSHClient microservice
     * @returns {Boolean} if can send messages
     */
    #handleSendMessages(message) {
        if (!this.hasConnected) throw "Not connected"
        this.client.write(message)
        return true
    }

    // Requests to SSHClient
    /**
     * This function sends a connection request into the chosen SSH Machine to the SSH Client.
     * @param {String} accountId the SSH machine account id(mongodb Account id)
     * @param {String} serverIP the SSH Machine server IP
     * @param {Number} serverPort the SSH Machine server Port
     * @param {String} accountName the SSH Machine account name
     * @param {String} accountPassword the SSH Machine account password
     */
    #sendConnectSSH(accountId, serverIP, serverPort, accountName, accountPassword) {
        const connectSSHCode = commands.request.connect
        this.#handleSendMessages(this.#convertMessageToString(connectSSHCode, {accountId, serverIP, serverPort, accountName, accountPassword}))
    }

    /**
     * This function sends a command to the ssh server
     * @param {String} accountId the SSH machine account id (mongodb account id)
     * @param {String} command the command to send to the SSH Server
     */
    #sendCommand(accountId, sender, command) {
        const sendCommandCode = commands.request.sendCommand
        this.#handleSendMessages(this.#convertMessageToString(sendCommandCode, {accountId, sender, command}))
    }


    /**
     * This function sends a request to the SSHClient microservice to connect to the chosen SSH machine.
     * @throws {Error} If SSH Client service returns a failure message.
     * @param {String} ServerIP The IP of the chosen SSH machine.
     * @param {Number} ServerPort The IP of the chosen SSH machine.
     */
    async connectSSH(AccountId, ServerIP, ServerPort, AccountName, AccountPassword) {
        const successServerResponse = commands.response.connect.success
        const failureServerResponse = commands.response.connect.fail
        // this.#handleSendMessages(this.#convertMessageToString(connectSSHCode, {ServerIP, ServerPort}))
        this.#sendConnectSSH(AccountId, ServerIP, ServerPort, AccountName, AccountPassword)
        return new Promise((resolve, reject) => {
            this.serviceEvent.on(successServerResponse, data => {
                console.log("(connectSSH) SSHClient succeeded")
                resolve(data);
                // if (ServerIP == SSHServerIP && ServerPort == SSHServerPort) {
                //     return resolve();
                // }
            })
            this.serviceEvent.on(failureServerResponse, data => {
                console.log("(connectSSH) SSHClient failed")
                reject(data.message);
                // if (ServerIP == SSHServerIP && ServerPort == SSHServerPort) {
                //     return reject();
                // }
            })
        })
        
    }
    /**
     * This function sends a command to the SSH machine using the SSH Client microservice.
     * @param {String} ServerIP Chosen SSH Server IP
     * @param {Number} ServerPort Chosen SSH Server Port
     * @param {String} command Chosen command to perform on the ssh server.
     * @param {String} userName Chosen User Name.
     */
    async sendCommand(AccountId, sender, command) {
        const successServerResponse = commands.response.connect.success
        const failureServerResponse = commands.response.connect.fail
        this.#sendCommand(AccountId, sender, command)
        // this.#handleSendMessages(this.#convertMessageToString(sendCommandCode, {ServerIP, ServerPort, command}))
        return new Promise((resolve, reject) => {
            this.serviceEvent.on(successServerResponse, data => {
                const { accountId: accountIdResponse, sender: senderResponse, command: commandResponse } = data
                if (accountIdResponse === AccountId && sender === senderResponse && commandResponse)
                    console.log("(sendCommand) SSHClient succeeded")
                    resolve(data);
                // if (ServerIP == SSHServerIP && ServerPort == SSHServerPort) {
                //     return resolve();
                // }
            })
            this.serviceEvent.on(failureServerResponse, data => {
                console.log("(sendCommand) SSHClient failed")
                reject(data.message);
                // if (ServerIP == SSHServerIP && ServerPort == SSHServerPort) {
                //     return reject();
                // }
            })
        })
        this.serviceEvent.on(sendCommandCode, (SSHServerIP, SSHServerPort, SSHUserName, SSHCommand, SSHResult) => {
            if (ServerIP == SSHServerIP && ServerPort == SSHServerPort && 
                userName == SSHUserName && command == SSHCommand) {
                return SSHResult;
            }
        })
    }
    /**
     * 
     * @param {String} event event to subscribe to
     * @param {Function} callback function that will occur when the chosen event is emitted. 
     */
    async on(event, callback) {
        this.client.on(event, callback);
    }
}

module.exports = SSHClient;