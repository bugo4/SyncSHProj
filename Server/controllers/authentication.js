const UserModel = require("../models/user")

module.exports.loginUser = async (req, res) => {
    const ReffererUrl = req.session.refferrerUrl || "/"
    console.log(ReffererUrl)
    const {username, password} = req.body;
    console.log(`user logged in! :0`)
    console.log(`username: ${username}, password: ${password}`)
    delete req.session.refferrerUrl
    res.json({type: 'success', message: "welcome back!"})
    // res.redirect(ReffererUrl)
}

module.exports.registerUser = async (req, res, next) => {
    try {
        const {username, password, email} = req.body
        const user = new UserModel({email, username, cachedUserServers: []})
        console.log(`User=`)
        console.log(user)
        const registeredUser = await UserModel.register(user, password)
        console.log(`registeredUser=`)
        console.log(registeredUser)
        // const ReffererUrl = req.session.refferrerUrl || "/"
        req.login(registeredUser, err => {
            if (err) return next(err)
            res.json({type: "success", message: "registered successfully!"})
            console.log("registered successfully!")
            // res.redirect(ReffererUrl)    
            delete req.session.refferrerUrl
            return;
        })
    } catch(e) {
        res.json({type: "error", message: e.message})
        console.log(e.message)
        // res.redirect("/")
    }
    
}

module.exports.handleIsLoggedIn = (req, res) => {
    if (req.session.rand === undefined) req.session.rand = Math.random() 
    res.json({
        type:"success",
        userName: `${req.user.username}`,
        test: req.session.rand
        // message: `Identified as: ${req.user}, and session: ${JSON.stringify(req.session)}`
    })
}

module.exports.logoutUser = (req, res) => {
    req.logout()
    return res.json({type: "success", message: "logged out... bye bye :("})
    // return res.redirect("/login")
}