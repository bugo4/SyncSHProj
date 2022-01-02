import React from 'react'
import DesktopApp from './DesktopApp/DesktopApp'

import './MachineApp.css'

export default function MachineApp({setOpenApps, setActiveApp}) {
    return (
            <div className="desktop_apps__grid">
                <DesktopApp/>
            </div>
        
    )
}
