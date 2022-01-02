const MachineModel = require("../models/machine") 
const machineUser = require("../models/machineAccount")
const MachineAccountModel = require("../models/machineAccount") 
const UserModel = require("../models/user")

const {connectToSSHServer} = require("../utils/sshConnection")

module.exports.getMachinesList = async (req, res) => {
    // const chosenUser = await UserModel.findById(req.user._id).populate('cachedUserServers')
    const chosenUser = await UserModel.findById(req.user._id).populate({
        path: "cachedUserServers",
        populate: {
            path: "serverConfiguration",
            select: ['serverIP', 'serverPort']
        }
    })
    console.log(chosenUser)
    if (!chosenUser) {
        return res.json({type: "error", message: "Unable to find user..."})
    }
    return res.json({type: "success", machines: chosenUser.cachedUserServers}) 
}

/*
Will add a new machine to the database, WITHOUT checking if the machine works for performance reasons.
*/
module.exports.addNewMachine = async (req, res) => {
    const {serverIP, serverPort, machineUserName, machineUserPassword} = req.body
    if (!serverIP || !serverPort || !machineUserName || !machineUserPassword) return res.json({"type": "error", message: "Missing request body parameters"})
    // Todo: validate machine user name for no redis collisions
    const userId = req.user._id
    const chosenUser = await UserModel.findById(userId)
    if (!chosenUser) return res.json({type: "error", message: "username does not exist..."})
    // let chosenMachine = await MachineModel.findMachine(serverIp, serverPort).populate('machineUsers')
    let chosenMachine;
    try {
        chosenMachine = await MachineModel.findOne({serverIP, serverPort})
    } catch(e) {
        return res.json({type: "error", message: e.message})
    }
    let chosenMachineAccount = undefined
    if (!chosenMachine) {
        console.log("A new machine has found!")
            chosenMachine = new MachineModel({serverIP: serverIP, serverPort})
        // chosenMachineAccount = new MachineUserModel({name: machineUserName, password: machineUserPassword, serverConfiguration: newMachine})
    } else {
        // chosenMachineAccount = await chosenMachine.machineUsers.findOne({name: machineUserName, machineUserPassword})
        console.log(chosenMachine)
        // chosenMachineAccount = await chosenMachine.machineUsers.findOne({name: machineUserName, machineUserPassword})
        chosenMachineAccount = await MachineAccountModel.findOne({serverConfiguration: chosenMachine._id, name: machineUserName, password: machineUserPassword})
        console.log(chosenMachineAccount)
        if (chosenMachineAccount) {
            // const userFoundMachineAccount = await chosenUser.cachedUserServers.findById(chosenMachineAccount._id)
            // const userFoundMachineAccount = await UserModel.find({_id: userId, cachedUserServers: {$elemMatch: {_id: chosenMachineAccount._id}}})
            const userFoundMachineAccount = await UserModel.findOne({_id: userId, cachedUserServers: {_id: chosenMachineAccount._id}})
            console.log(userFoundMachineAccount)
            if (userFoundMachineAccount) {
                return res.json({type: "error", message: "You already have this machine..."})
            } else {
                chosenUser.cachedUserServers.push(chosenMachineAccount)
                await chosenUser.save()
                return res.json({type: "success", message: "Added the machine to the user's list"})
            }
        }
    }
        chosenMachineAccount = new MachineAccountModel({name: machineUserName, password: machineUserPassword, serverConfiguration: chosenMachine})
    
        chosenMachine.machineUsers.push(chosenMachineAccount)
    try{    
        await chosenMachine.save()
        await chosenMachineAccount.save()
    }
    catch (e) {
        return res.json({type: "error", message: e.message})
    }

    chosenUser.cachedUserServers.push(chosenMachineAccount)
    await chosenUser.save()
    return res.json({type: "success", message: "Added the machine to the user's list"})
}

module.exports.deleteMachine = async (req, res) => {
    const {accountId} = req.body
    const {_id: userId} = req.user
    if (!accountId)
        return res.json({type: "error", message: "No account id was found!"})
    console.log(req.user);
    /*
    const DeleteResult = await UserModel.updateOne(
        { _id: userId },
        { $pull: { cachedUserServers: { _id: accountId } } }
    )

    UserModel.updateOne({ _id: userId }, {
        $pullAll: {
            cachedUserServers: [accountId],
        },
    });
    */
   const foundUser = await UserModel.findById(userId)
   const foundResult = await foundUser.cachedUserServers.pull({_id: accountId})
   if (!foundResult) return res.json({type: "error", message: "Account id is not correct..."})
   console.log(foundUser)
    await foundUser.save();
    return res.json({type: "success", message: "Deleted the machine from the user's list"})
}

module.exports.connectToMachine = (req, res) => {

}