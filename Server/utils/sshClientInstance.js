const SSHClient = require("./sshClient")

const client = new SSHClient();
client.on("error", (err) => console.log("SSH Client error", err));

client.connect()


module.exports = client