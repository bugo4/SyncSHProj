import { Button, CircularProgress, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import axios from 'axios'

import './MachineOptions.css'
import { Alert } from '@material-ui/lab'

export default function MachineOptions({machine}) {
    const [isLoading, setIsLoading] = useState(false)
    const [serverResponse, setServerResponse] = useState();
    function handleDeleteMachine(event) {
        setIsLoading(true)
        axios.delete("/ssh/servers/", {data: {accountId: machine._id}})
        .then(res => {
            console.log(res)
            setServerResponse(res.data)
        })
        .catch(err => {
            console.error(err)
            setServerResponse(err.data)
            console.error(serverResponse)
        })
        .finally(() => {
            setIsLoading(false)
        });
    }
    return (
        <div className="machine_options">
        {!isLoading ? 
            <>
                <Typography variant="h2"><strong>{machine.name}</strong></Typography>
                <Typography variant="h3">{machine.serverConfiguration.serverIP}:{machine.serverConfiguration.serverPort}</Typography>

                <Button variant="contained" color="secondary" style={{marginTop: 10, marginBottom: 10}} onClick={handleDeleteMachine}>Delete Machine</Button>
                {serverResponse && <Alert severity={serverResponse.type}>{serverResponse.message}</Alert>}
            </>
             : 
            <CircularProgress size={100}/>
        }
        </div>
    )
}