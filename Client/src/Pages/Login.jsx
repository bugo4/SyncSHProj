import React from 'react'
import { Link } from 'react-router-dom'
import LoginForm from '../Authorization/Login/LoginForm'

export default function Login({setUsername}) {
    return (
        <div>
            <LoginForm setUsername={setUsername} />
            <Link to="/register">Don't have an account? Register here</Link>
        </div>
    )
}
