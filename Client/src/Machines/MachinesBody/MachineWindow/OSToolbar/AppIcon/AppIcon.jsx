import React from 'react'

import './AppIcon.css'

export default function AppIcon({srcIcon, isActive, onOpenApp, name, windowElement}) {
    return (
            <img src={srcIcon} className={"os_toolbar__icon__app" + (isActive ? " os_toolbar_icon__active" : "")}
            onClick={() => onOpenApp({srcIcon, isActive, onOpenApp, name, windowElement})} title={name} alt={name}/>
    )
}
