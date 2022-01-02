/* This script handles communication between the web-backend and ssh-client */
module.exports.connectToMachine = (serverIp, serverPort, machineUserName, machineUserPassword) => {
    console.log(`connecting to: ${serverIp}:${serverPort}. Name: ${machineUserName}, password: ${machineUserPassword}`)
    return true;
}