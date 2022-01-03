import React from "react";

import "./MachinesBody.css";
import MachineWindow from "./MachineWindow/MachineWindow";


export default function MachinesBody({activeMachine, sendMessage, machineResponse, onSSHCommand}) {

  function handleMachineSettings(event) {
    alert(event)
    event.preventDefault();
  }

  return (
    activeMachine ? (
    <>
    <MachineWindow activeMachine={activeMachine} machineResponse={machineResponse} onSSHCommand={onSSHCommand}/>
    </> ): 
    <img
      className="machines_start_image"
      src="images/machines/menubackground.jpg"
      onClick={handleMachineSettings}
    />
  );
}
