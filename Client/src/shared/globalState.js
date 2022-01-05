const {atom} = require("recoil")

export const serverCommandResponseState = atom({
    key: 'serverCommandResponseState',
    default: ""
}) 

export const hasSeenLogsNotificationsState = atom({
    key: 'hasSeenLogsNotificationsState',
    default: true
}) 