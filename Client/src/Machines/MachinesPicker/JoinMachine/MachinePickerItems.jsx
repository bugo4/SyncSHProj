import React, { useState, useEffect } from 'react'

import "./JoinMachine.css";
import machineSettingsIcon from "../../../assets/machine_settings_icon.png";
import MachineOptions from '../MachineOptions/MachineOptions';


export default function MachinePickerItems({userMachinesList, onPickMachine}) {
  const [pickedMachineOptions, setPickedMachineOptions] = useState(null)

  useEffect(() => {
    setPickedMachineOptions(null)
  }, [])

  function handleItemOptions(event, machine) {
    event.stopPropagation();
    console.dir(machine);
    setPickedMachineOptions(machine);
  }

    return (

      !pickedMachineOptions ? (
        <div className={"machine_picker_items"}>
          {userMachinesList.map((machine) => 
            <div className={"machine_picker_item"} key={machine._id}
             title={`${machine.serverConfiguration.serverIP}:${machine.serverConfiguration.serverPort}`}
             onClick={() => onPickMachine(machine)}>
              <h1 className={"machine_picker_item__header"}> {machine.name}</h1>
              <img
                className={"machine_picker_item__icon"}
                src={machineSettingsIcon}
                onClick={(e) => handleItemOptions(e, machine)}
              />
            </div>
          )}
        </div>
    )
        :
        <MachineOptions machine={pickedMachineOptions}/>
    )
}
