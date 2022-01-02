import React from "react";
import "./MachinesTop.css";

import Button from "@material-ui/core/Button";
import MachinesTab from "./MachinesTab/MachinesTab";

export default function MachinesTop({openMachines, onShowMachinesPicker, onTabClicked, activeMachine}) {
  function handleShowMachines(event) {
    onShowMachinesPicker()
  }
  return (
    <div className="title">
      <Button
      title={"Show machines"}
        onClick={handleShowMachines}
        variant={"contained"}
        color="primary"
      >
        +
      </Button>
      <MachinesTab openMachines={openMachines} activeMachine={activeMachine} onTabClicked={onTabClicked}/>
      
      

    </div>
  );
}
