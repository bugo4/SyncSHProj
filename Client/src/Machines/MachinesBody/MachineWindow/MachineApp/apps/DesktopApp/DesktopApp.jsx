import React from "react";

import AppIcon from "./AppIcon.png";

import "./DesktopApp.css";

export default function DesktopApp() {
    return (
        <div className="desktop_apps__grid">
            <div className="desktop_app">
                <img src={AppIcon} className="desktop_app__icon" />
                {/* <p className="desktop_app__title">Illustrator</p> */}
                <h3 className="desktop_app__title">Illustrator</h3>
            </div>

            <div className="desktop_app">
                <img src={AppIcon} className="desktop_app__icon" />
                {/* <p className="desktop_app__title">Illustrator</p> */}
                <h3 className="desktop_app__title">Illustrator</h3>
            </div>
        </div>
    );
}
