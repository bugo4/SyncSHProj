const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const machineSchema = new Schema({
    serverIP: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                if (v === "127.0.0.1") return false;
                console.log(`Validating ${v}`)
                const ipNumbers = v.split('.')
                console.log(ipNumbers)
                if (ipNumbers.length != 4) return false;
                for (ipNumber in ipNumbers) {
                    const parsedIpNumber = parseInt(ipNumber)
                    if (isNaN(parsedIpNumber)) return false; 
                    if (parsedIpNumber < 0 || parsedIpNumber > 255) return false;
                }
                return true;
            },
            message: props => `Not a valid IP!`
        }
    },
    serverPort: {
        type: Number,
        min: [0, "port number's minimum is 0"],
        max: [65535, "port number's maximum is 65535"],
        required: true
    },
    machineUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'MachineAccount'
    }]
})

machineSchema.statics.findMachine = async function(serverIP, serverPort) {
    return this.findOne({serverIP, serverPort})
}



module.exports = mongoose.model("Machine", machineSchema)