import React, { createRef } from "react";

import "./TerminalApp.css";
import Terminal from "react-console-emulator";
import { useEffect } from "react";

import axios from 'axios'

export default function TerminalApp({ activeMachine, machineResponse, onSSHCommand }) {
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
    useEffect(() => {
        terminalRef.current.pushToStdout(machineResponse)
    }, [machineResponse])
    async function handleCommand(result) {
        const chosenCommand = result.rawInput;
        const serverResponse = await onSSHCommand(chosenCommand)
        terminalRef.current.pushToStdout(serverResponse.message)
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

    return terminal;
}
