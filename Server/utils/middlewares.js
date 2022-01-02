// User middleware
function isLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        console.log(req.originalUrl)
        // req.session.refferrerUrl = req.originalUrl
        return res.json({type: "error", message: "You must login first!"})
    }
    next()
}

function isNotLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        // Todo: add a custom message type - like redirect
        return res.json({type: "success", message: "alreaddy logged in :)", userName: req.user.username})
    }
    next()
}



module.exports.isLoggedIn = isLoggedIn;
module.exports.isNotLoggedIn = isNotLoggedIn;