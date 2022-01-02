const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const machineAccountSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    serverConfiguration: {
        type: Schema.Types.ObjectId,
        ref: 'Machine'
    }
})

module.exports = mongoose.model("MachineAccount", machineAccountSchema)