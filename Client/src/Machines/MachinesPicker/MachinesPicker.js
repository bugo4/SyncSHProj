import React from "react";
import { useState, useEffect } from "react";

import getUserMachines from "./MachinesPickerControls";
import "./MachinePicker.css";

import MachinePickerItems from "./JoinMachine/MachinePickerItems";
import { CircularProgress } from "@material-ui/core";
import MachinePickerCreateMachine from "./CreateMachine/MachinePickerCreateMachine";

export default function MachinesPicker({ onCloseMachinesPicker, onPickMachine }) {
  const [userMachinesList, setUserMachinesList] = useState([]);
  const [createNewMachine, setCreateNewMachine] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  const [activeOptionElement, setActiveOptionElement] = useState(null);
  
  const Messages = {
    createNewMachine: "New Machine",
    joinMachine: "Machines List"
  }

  useEffect(() => {
    if (createNewMachine) {
      setActiveOptionElement(<MachinePickerCreateMachine/>)
    } else {
      setActiveOptionElement ( isLoading ?
      <div className={"machine_picker_items__loading"}>
      <CircularProgress size={75}/>
    </div> : <MachinePickerItems userMachinesList={userMachinesList} onPickMachine={onPickMachine}/>)
    }
  }, [createNewMachine, isLoading])

  useEffect(() => {
    getUserMachines()
      .then((machines) => {
        console.dir(machines);
        setUserMachinesList(machines);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false)
      });
  }, []);
  return (
    <div>
      <div
        className="machine_picker__backdrop"
        onClick={() => onCloseMachinesPicker()}
      />
      <div className="machine_picker__modal">
        <div className={"machine_picker_title"}>
          <h1 className={"machine_picker_title_heading"}>
            {createNewMachine ? Messages.createNewMachine : Messages.joinMachine}
          </h1>
        </div>
        {activeOptionElement}
        
        <div className={"machine_picker_footer"}>
            <button className={"machine_picker_footer__button"} onClick={(event) => setCreateNewMachine(!createNewMachine)}>
              {!createNewMachine ? Messages.createNewMachine : Messages.joinMachine}
            </button>
        </div>
      </div>
    </div>
  );
}
