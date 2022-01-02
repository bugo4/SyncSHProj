const UserModel = require('../models/user')

module.exports.connectToAccount = (userId, username, machineAccountId, req) => {
    const foundUser = UserModel.findOne({ _id: userId, username, 
        cachedUserServers: {$elemMatch: {_id: machineAccountId._id}}})
    if (!foundUser) return false;
    // Send request to the SSH Client
    return true
}