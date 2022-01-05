# SyncSH - Made By Noam Bigelman
## _Sync Clients Between SSH_


## Client:
- Web Frontend
## Middle Server:
- Web Backend
- SSH Client Microservice

## Routes
- Authentication
    - Register
    - Log in
    - Logout
    - isLoggedIn(For automatic logins)
-  Machines
    -   Get the list of machines saved by the client(MongoDB)
    -   Create a new machine and push it to the saved machines(MongoDB)
    -   Delete a machine
- SSHClient
    - connect - connect to a ssh machine
    - command - send a command to the chosen ssh machine
    - ws connection - for realtime ssh client responses and clients sync(Using Redis)

## Tech
 - Web Frontend: React, Material UI, Websockets
 - Web Backend: Express, MongoDB, Redis, Websockets 