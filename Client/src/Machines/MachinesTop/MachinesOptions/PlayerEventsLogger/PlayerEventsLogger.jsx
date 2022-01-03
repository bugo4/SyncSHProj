import React from "react";
import { useState } from "react";

import { Typography } from '@material-ui/core'

import LogsIcon from "../../../../assets/logs_icon.png";
import LogsActiveIcon from "../../../../assets/logs_icon_active.png";

/**
 *
 * @param {Array} playerEvents contains all the player events.
 *                  Exapmple: [{type: "sendMessage", command: "echo hi", response: "hi"}]
 * @returns
 */
export default function PlayerEventsLogger({ playerEvents }) {
    const [isActive, setIsActive] = useState(false);
    function handleLogsIconClick(event) {
        console.log(playerEvents);
        setIsActive(!isActive);
    }
    return (
        <>
            <img
                src={isActive ? LogsActiveIcon : LogsIcon}
                style={{ marginLeft: 20, height: "95%", alignSelf: "center" }}
                onClick={(e) => handleLogsIconClick(e)}
                title="Show logs"
                alt="Show logs icon"
            />
            {isActive && (
                <div
                    style={{
                        position: "absolute",
                        top: "10%",
                        right: 0,
                        width: "25vw",
                        // height: "50vh",
                        backgroundColor: "white",
                        zIndex: 2,
                        padding: 10
                    }}
                >
                    {playerEvents.map((playerEvent) => {
                        if (playerEvent.type === "command") {
                            return (
                                <Typography>
                                    <strong>{playerEvent.sender}</strong>: {playerEvent.command}
                                </Typography>
                            );
                        }
                    })}
                </div>
            )}
        </>
    );
}
