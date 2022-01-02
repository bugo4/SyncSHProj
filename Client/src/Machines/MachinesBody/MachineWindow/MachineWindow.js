import React from "react";
import { useState, useEffect } from "react";
import LoadingWindow from "./LoadingWindow/LoadingWindow";

import { handleConnectionRequest } from "../MachinesBodyController";
import MachineApp from "./MachineApp/MachineApp";
import OSToolbar from "./OSToolbar/OSToolbar";

import "./MachineWindow.css";
import { Alert, AlertTitle } from "@material-ui/lab";


import DesktopApp from "./MachineApp/apps/DesktopApp/DesktopApp";
import DesktopIcon from "../../../assets/syncsh_icon.png" 

import TerminalApp from "./MachineApp/apps/TerminalApp/TerminalApp";
import TerminalIcon from "../../../assets/terminal_icon.png" 

// import { useCancelToken } from '../../../utils/hooks';
function createTaskbarApp(name, windowElement, srcIcon) {
    return {name, windowElement, srcIcon}
}

export default function MachineWindow({ activeMachine }) {
    const mainApp = createTaskbarApp("Desktop", <DesktopApp/>, DesktopIcon)

    const [connectionResponse, setConnectionResponse] = useState(null);
    const [openApps, setOpenApps] = useState([
        mainApp,
        createTaskbarApp("Terminal", <TerminalApp/>, TerminalIcon)
    ])
    const [activeApp, setActiveApp] = useState(mainApp)

    useEffect(() => {
        setConnectionResponse(null);
        console.log(activeMachine);
        handleConnectionRequest(activeMachine._id)
            .then((res) => {
                console.log(res);
                setConnectionResponse(res);
            })
            .catch((err) => {
                setConnectionResponse({ type: "error", message: err });
                console.log(err);
                // Todo: Add an option to try again or leave tab back to menu
            });
        return () => {console.log("returning")}
    }, [activeMachine]);

    function handleOpenApp(openedApp) {
        for(let i = 0; i < openApps.length; i++) {
            if (openApps[i].name === openedApp.name) {
                setActiveApp(openedApp)
                return;
            }
        }
        alert("No match was found...")
        console.dir(openApps)
        console.dir(openedApp)
        openApps.push(openedApp)
        setActiveApp(openedApp)
    }

    function getConnectionResponseElements() {
        const { type } = connectionResponse;
        if (connectionResponse.type === "success")
            // OS App
            // OS Toolbar
            return (
                <div className="os_window_body">
                    <div className="desktop_apps__container">
                        <MachineApp setOpenApps={setOpenApps} setActiveApp={setActiveApp} activeApp={activeApp}/>
                        <OSToolbar openApps={openApps} activeApp={activeApp} onOpenApp={handleOpenApp}/>
                    </div>
                </div>
            );
        return (
            <div
                style={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Alert severity="error">
                    <AlertTitle>
                        <strong>Error</strong>
                    </AlertTitle>
                    {connectionResponse.message}
                </Alert>
            </div>
        );
    }

    useEffect(() => {
        console.log("Changed machine");
    }, [activeMachine]);
    return (
        <>
            {!connectionResponse ? (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <LoadingWindow activeMachine={activeMachine} />
                </div>
            ) : (
                getConnectionResponseElements()
            )}
        </>
    );
}
