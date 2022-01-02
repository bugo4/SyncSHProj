import React from 'react'
import DesktopApp from './apps/DesktopApp/DesktopApp'

import './MachineApp.css'

export default function MachineApp({setOpenApps, setActiveApp, activeApp}) {
    return (
            <div style={{width: "100%", height: "100%"}}>
                {activeApp.windowElement}
            </div>
        
    )
}
