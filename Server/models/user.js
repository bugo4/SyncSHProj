const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const validator = require("validator");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: false,
    validate: {
      validator: function (v) {
        console.log(validator.isEmail(v));
        return validator.isEmail(v);
      },
      message: props => `Not a valid email!`
    },
  },
  cachedUserServers: [
    {
      type: Schema.Types.ObjectId,
      ref: "MachineAccount",
    },
  ],
});
// Adds username and passport to User Schema
// Adds static methods, like:
// authenticate()
UserSchema.plugin(passportLocalMongoose);

UserSchema.statics.doesUserExist = async function (username) {
  return await this.find({ username });
};

UserSchema.methods.containsMachine = async function (serverIp, serverPort, machineUserName, machineUserPassword) {
  await this.populate({
    path: "cachedUserServers",
    populate: {
        path: "serverConfiguration"
    }
  })
  console.log(this)
  const relevantMachines = await this.cachedUserServers.serverConfiguration.find({serverIp, serverPort})
  console.log(relevantMachines)
  return relevantMachines.find({name: machineUserName})
}

module.exports = mongoose.model("User", UserSchema);
