import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

import './Home.css'

import MainIcon from '../assets/syncsh_icon.png'

export default function Home() {
    let navigate = useNavigate();
    return (
        <div className="home_container">
            <div className="home_grid">
                <img className="home_icon__main" src={MainIcon}/>
                <button className="home_button home_button__login" onClick={() => navigate("/login")}>Sync In!</button>
                <button className="home_button home_button__register" onClick={() => navigate("/register")}>Register</button>
            </div>
        </div>
    )
}
