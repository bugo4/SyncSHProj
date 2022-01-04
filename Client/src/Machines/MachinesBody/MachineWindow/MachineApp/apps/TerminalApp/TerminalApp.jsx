import React, { createRef } from "react";

import "./TerminalApp.css";
import Terminal from "react-console-emulator";
import { useEffect } from "react";

import {useRecoilValue} from 'recoil'
import {serverCommandResponseState} from '../../../../../../shared/globalState'
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

export default function TerminalApp({ activeMachine, machineResponse, onSSHCommand }) {

    const [notify, setNotify] = React.useState({isOpen: false, type: "error", message: ""});

    // const xtermRef = React.useRef(null);

    // React.useEffect(() => {
    //     // You can call any method in XTerm.js by using 'xterm xtermRef.current.terminal.[What you want to call]
    //     // document.querySelector(".terminal.xterm").style.height = "100%";
    //     xtermRef.current.terminal.writeln("Hello, Worldy!");
    // }, []);
    // return (
    //     <XTerm
    //         ref={xtermRef}
    //         style={{ width: "100%", height: "100%" }}
    //         onKey={(key, ev) => {
    //             if (!key) return
    //             console.log(key.key.charCodeAt());
    //             if (key.key.charCodeAt() == 13) xtermRef.current.terminal.write("\n");
    //             xtermRef.current.terminal.write(key.key);
    //         }}
    //     />
    // );
    // useEffect(() => {
    //     alert(machineResponse)
    //     terminalRef.current.pushToStdout(machineResponse)
    // }, [machineResponse])
    // useEffect(() => {
    //     machineResponse.on("success", result => {
    //         alert(result)
    //         terminalRef.current.pushToStdout(result)
    //     })
    // }, [])
    const serverCommandResponse = useRecoilValue(serverCommandResponseState)
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    useEffect(() => {
        terminalRef.current.pushToStdout(serverCommandResponse);
    }, [serverCommandResponse])
    
    async function handleCommand(result) {
        const chosenCommand = result.rawInput;
        const serverResponse = await onSSHCommand(chosenCommand)
        if (serverResponse.data?.type === "error") {
            setNotify({isOpen: true, type: "error", message: serverResponse.data?.message})
        }
        console.dir(serverResponse)
    }

    function handleClose(e, reason) {
        setNotify({isOpen: false, type: "error", message: ""})
    }

    const terminalRef = createRef();
    let terminal = (
        <Terminal
            errorText={" "}
            ref={terminalRef}
            noDefaults
            commands={{}}
            commandCallback={handleCommand}
            style={{
                height: "100%",
                maxHeight: "100%",
                backgroundColor: "#0000000f",
                background:
                    "url('https://storage.needpix.com/rsynced_images/abstract-wallpaper-1442844111BON.jpg')",
            }}
            promptLabel={<b>{activeMachine.name}@SyncSH:~$</b>}
            welcomeMessage={["Welcome to the terminal emulator!"]}
            processCommand={() => console.log("Processing.....")}
        />
    );
    useEffect(() => {
        console.log(terminalRef);
        terminalRef.current.pushToStdout("Wassup ");
    }, []);

    return <>
        {terminal}
        <Snackbar
            open={notify.isOpen}
            autoHideDuration={3000}
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            onClose={handleClose}
            >
            <Alert 
                severity={notify.type}
                onClose={handleClose}
                >
                    {notify.message}
            </Alert>
        </Snackbar>
    </>;
}
