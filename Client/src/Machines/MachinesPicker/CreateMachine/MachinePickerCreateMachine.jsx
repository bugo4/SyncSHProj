import { Box, TextField, Button, Container } from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import axios from "axios";
import React from "react";
import {useRef, useState} from "react";

import "./CreateMachine.css";

export default function MachinePickerCreateMachine() {
    const ServerIPRef = useRef()
    const ServerPortRef = useRef()
    const AccountNameRef = useRef()
    const AccountPassRef = useRef()
    const [serverResponse, setServerResponse] = useState()
    function handleAddMachine(event) {
        const serverIP = ServerIPRef.current.value
        const serverPort = ServerPortRef.current.value
        const machineUserName = AccountNameRef.current.value
        const machineUserPassword = AccountPassRef.current.value
        axios
            .post("/ssh/servers/", { serverIP, serverPort, machineUserName, machineUserPassword })
            .then((data) => {
                const res = data.data;
                setServerResponse(res)
            })
            .catch((err) => {
                setServerResponse(err)
            });
    };
  return (
    <div className={"machine_items_create"}>
      <Container style={{marginTop: 10}}>
        <Box style={{ display:"flex", flexDirection: 'column' }}>
          <TextField
            required
            id="outlined-required"
            label="Server IP"
            fullWidth
            margin="normal"
            inputRef={ServerIPRef}
          />
          <TextField
            required
            type="number"
            id="outlined-required"
            label="Server Port"
            fullWidth
            margin="normal"
            inputRef={ServerPortRef}
          />
          <TextField
            required
            id="outlined-required"
            label="Account Name"
            fullWidth
            margin="normal"
            inputRef={AccountNameRef}
          />
          <TextField
            required
            id="outlined-required"
            label="Account Password"
            fullWidth
            margin="normal"
            type="password"
            inputRef={AccountPassRef}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ height: 40, marginTop: 10 }}
            onClick={handleAddMachine}
          >
            Add to collection
          </Button>
          {serverResponse && <Alert severity={serverResponse.type}>{serverResponse.message}</Alert>}
        </Box>
      </Container>
    </div>
  );
}
