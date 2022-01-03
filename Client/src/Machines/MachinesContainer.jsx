import React from "react";
import { useState, useEffect } from "react";
import MachinesBody from "./MachinesBody/MachinesBody";
import MachinesPicker from "./MachinesPicker/MachinesPicker";
import MachinesTop from "./MachinesTop/MachinesTop";

import useWebSocket, { ReadyState } from "react-use-websocket";
import MachinesOptions from "./MachinesTop/MachinesOptions/MachinesOptions";

import MachineControls from './MachineControls'

// import events from "events"
import { useRecoilState } from 'recoil'
import {serverCommandResponseState} from '../shared/globalState'

export default function MachinesContainer({ username }) {
    const [openMachines, setOpenMachines] = useState([]);
    const [showMachines, setShowMachines] = useState(false);
    const [activeMachine, setActiveMachine] = useState();
    const [roomPlayers, setRoomPlayers] = useState([]);
    const [playerEvents, setPlayerEvents] = useState([]);
    // const machineResponse = new events.EventEmitter();
    const [serverCommandResponse, setServerCommandResponse] = useRecoilState(serverCommandResponseState);

    const SocketUrl = "ws://localhost:5000/ssh/client";

    const { sendMessage, lastMessage, readyState } = useWebSocket(SocketUrl);

    useEffect(() => {
        setOpenMachines([
            {
                _id: "12",
                serverIp: "143.123.10.2",
                serverPort: 23,
                name: "hugabuga's machine",
            },
        ]);
        setRoomPlayers([
                "Huga", "Buga", "Noam", "Liad", "Yair", "Galit", "Guy"
        ])
    }, []);

    useEffect(() => {
        if (!lastMessage) return
        const { op, d }= JSON.parse(lastMessage.data)
        switch (op) {
            case 10:
                setRoomPlayers([...d])
                break;
            case 20:
                console.dir(d)
                if (d.sender == username) {
                    // machineResponse.emit("success", d.result)
                    setServerCommandResponse(d.result)
                } 
                setPlayerEvents([...playerEvents, {type: "command", ...d }])
                break
        }
        // Handle get room players
    }, [lastMessage])

    function handleShowMachinesPicker() {
        setShowMachines(true);
    }
    function handleCloseMachinesPicker() {
        setShowMachines(false);
    }

    function handlePickMachine(machine) {
        if (readyState !== ReadyState.OPEN) {
            alert("Opening a ws connection...." + readyState)
            return;
        }

        console.log(machine._id);
        setShowMachines(false);
        let foundMachine = false;
        for (let i = 0; i < openMachines.length && !foundMachine; i++) {
            if (openMachines[i]._id === machine._id) foundMachine = true;
        }
        if (!foundMachine) openMachines.push(machine);
        setRoomPlayers([])
        setActiveMachine(machine);
    }

    function handleTabClicked(machine) {
        if (activeMachine?._id === machine._id) return; 
        setRoomPlayers([])
        setActiveMachine(machine);
    }

    function handleSendSSHCommand(command) {
        return MachineControls.sendSSHCommand(activeMachine._id, command, username)
    }

    return (
        <div
            style={{
                backgroundColor: "#2b2b2b",
                width: "100vw",
                height: "100vh",
            }}
        >
            {/* <h1 style={{color:"white"}}>Username: {username}</h1> */}
            <MachinesTop
                openMachines={openMachines}
                onShowMachinesPicker={handleShowMachinesPicker}
                onTabClicked={handleTabClicked}
                activeMachine={activeMachine}
            />
            <MachinesOptions roomPlayers={roomPlayers} wsReadyState={readyState} username={username} playerEvents={playerEvents}/>
            <MachinesBody activeMachine={activeMachine} sendMessage={sendMessage} machineResponse={""} onSSHCommand={handleSendSSHCommand}/>
            {showMachines && (
                <MachinesPicker
                    onCloseMachinesPicker={handleCloseMachinesPicker}
                    onPickMachine={handlePickMachine}
                />
            )}
        </div>
    );
}
