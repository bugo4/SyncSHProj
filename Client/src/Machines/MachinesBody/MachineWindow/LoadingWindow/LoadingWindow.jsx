import React from 'react'

import './LoadingWindow.css'

export default function LoadingWindow({activeMachine}) {
    return (
        <>
          <h1 className={"loading_window_header"}>Loading {activeMachine.name}...</h1>  
        </>
    )
}
