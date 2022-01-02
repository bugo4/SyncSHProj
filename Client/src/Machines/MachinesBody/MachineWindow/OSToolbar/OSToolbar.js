import React from 'react'

import MainIcon from '../../../../assets/syncsh_icon.png'
import AppIcon from './AppIcon/AppIcon'

import './OSToolbar.css'

export default function OSToolbar({openApps, activeApp, onOpenApp}) {
    return (
        <div className="os_toolbar">
            <AppIcon srcIcon={MainIcon} isActive={true} onOpenApp={onOpenApp} name={"MainApp"}/>
            <AppIcon srcIcon={MainIcon} isActive={false} onOpenApp={onOpenApp} name={"Main2App"}/>
            {/* {openApps.map(openApp =>  openApp === activeApp ? )} */}
            {/* {activeApp && <img src={MainIcon} className="os_toolbar__icon__app" />} */}
            
        </div>
    )
}
