import React from "react";

import Button from "@material-ui/core/Button";

export default function MachinesTab({ openMachines, onTabClicked, activeMachine }) {
  const NAME_MAX_LENGTH = 15;
  const NAME_SUFFIX = "...";

  function limitName(name) {
    if (name.length <= NAME_MAX_LENGTH) return name
    return name.substring(0, NAME_MAX_LENGTH - NAME_SUFFIX.length) + NAME_SUFFIX
  }
  function handleGetTabColor(openMachine) {
    if (!activeMachine) return "secondary"
    if (activeMachine._id === openMachine._id) return "primary"
    return "secondary"
  }
  console.log(openMachines)
  return (
    <>
      {openMachines.map((openMachine) => (
        <Button
          key={`${openMachine.serverConfiguration?.serverIP}:${openMachine.serverConfiguration?.serverPort}-${openMachine.name}`}
          variant={"contained"}
          color={handleGetTabColor(openMachine)}
          title={`${openMachine.serverConfiguration?.serverIP}:${openMachine.serverConfiguration?.serverPort}`}
          onClick={() => onTabClicked(openMachine)}
        >
          {limitName(openMachine.name)}
        </Button>
      ))}
    </>
  );
}
