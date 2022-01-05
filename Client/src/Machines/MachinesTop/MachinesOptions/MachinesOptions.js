import { Avatar, Typography } from '@material-ui/core'
// import { deepOrange, deepPurple, grey, lightBlue } from '@material-ui/core/colors'
import { Alert, AvatarGroup } from '@material-ui/lab'
import React from 'react'
import { ReadyState } from 'react-use-websocket'


import './MachinesOptions.css'
import PlayerEventsLogger from './PlayerEventsLogger/PlayerEventsLogger'

export default function MachinesOptions({roomPlayers, wsReadyState, username, playerEvents}) {
    const wsConnectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
      }[wsReadyState];
    //   const colors = [deepOrange[500], deepPurple[500], lightBlue[500], grey]

    return (
        <div className="options_title__container">
            <Alert severity={wsReadyState === ReadyState.OPEN ? 'success' : "error"} style={{margin: 0, padding: 0, paddingInlineStart: 5, alignSelf: "center"}}>{wsConnectionStatus}</Alert>
            <AvatarGroup max={4} style={{alignSelf: "center", padding: 10}}>
                {roomPlayers.map((roomPlayer, i) =>
                    // <Avatar key={roomPlayer} style={{ backgroundColor: colors[i%colors.length] }}>{roomPlayer[0]}</Avatar>
                    <Avatar key={roomPlayer} src={`https://avatars.dicebear.com/api/personas/${roomPlayer}.svg`} title={roomPlayer}/>
                )}
            </AvatarGroup>
            <Typography style={{marginLeft: "30px", alignSelf: "center"}}>User: {username}</Typography>
            <PlayerEventsLogger playerEvents={playerEvents}/>
        </div>
    )
}
