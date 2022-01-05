import React from "react";
import { useState } from "react";

import { Typography } from '@material-ui/core'

import LogsIcon from "../../../../assets/logs_icon.png";
import LogsActiveIcon from "../../../../assets/logs_icon_active.png";
import LogsNotificationsIcon from "../../../../assets/logs_icon_notifications.png";

import { useRecoilState } from 'recoil'
import { hasSeenLogsNotificationsState } from '../../../../shared/globalState'

/**
 *
 * @param {Array} playerEvents contains all the player events.
 *                  Exapmple: [{type: "sendMessage", command: "echo hi", response: "hi"}]
 * @returns
 */
export default function PlayerEventsLogger({ playerEvents }) {
    const [isActive, setIsActive] = useState(false);

    const [hasSeenLogsNotifications, setHasSeenLogsNotifications] = useRecoilState(hasSeenLogsNotificationsState);

    function handleLogsIconClick(event) {
        console.log(playerEvents);
        setIsActive(!isActive);
        setHasSeenLogsNotifications(true)
    }

    function getLogsIcon() {
        if (isActive) return LogsActiveIcon
        if (!hasSeenLogsNotifications) return LogsNotificationsIcon
        return LogsIcon
    }
    return (
        <>
            <img
                src={getLogsIcon()}
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
                        padding: 10,
                        maxHeight: "50%",
                        overflow: "auto",
                        boxShadow: "5px 10px 50px grey"
                    }}
                >
                    {playerEvents.map((playerEvent) => {
                        if (playerEvent.type === "command") {
                            return (
                                <Typography key={playerEvent.type+playerEvent.sender+playerEvent.command}>
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