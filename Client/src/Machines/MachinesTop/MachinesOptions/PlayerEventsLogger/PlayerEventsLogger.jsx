import React from 'react'

import LogsIcon from '../../../../assets/logs_icon.png'

/**
 * 
 * @param {Array} playerEvents contains all the player events.
 *                  Exapmple: [{type: "sendMessage", command: "echo hi", response: "hi"}]
 * @returns 
 */
export default function PlayerEventsLogger({playerEvents}) {
    return (
        <img src={LogsIcon} style={{marginLeft: 20, height: "95%", alignSelf: "center"}} onClick={(e) => console.log(playerEvents)} />
    )
}
