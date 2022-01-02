import React from 'react'

import AppIcon from './AppIcon/AppIcon'

import './OSToolbar.css'


export default function OSToolbar({openApps, activeApp, onOpenApp}) {
    return (
        <div className="os_toolbar">
            {openApps.map(openApp => (
                <AppIcon srcIcon={openApp.srcIcon} name={openApp.name} windowElement={openApp.windowElement} 
                    onOpenApp={onOpenApp} isActive={activeApp?.name === openApp.name} key={openApp.name} />
            ))}
            {/* <AppIcon srcIcon={MainIcon} isActive={activeApp?.name === this.name} onOpenApp={onOpenApp} name={"MainApp"}/>
            <AppIcon srcIcon={TerminalIcon} isActive={false} onOpenApp={onOpenApp} name={"Main2App"} windowElement={<TerminalApp/>}/> */}
            {/* {openApps.map(openApp =>  openApp === activeApp ? )} */}
            {/* {activeApp && <img src={MainIcon} className="os_toolbar__icon__app" />} */}
            
        </div>
    )
}
