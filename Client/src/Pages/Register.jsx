import React from 'react'
import { Link } from 'react-router-dom'
import RegisterForm from '../Authorization/Register/RegisterForm'

export default function Register({setUsername}) {
    return (
        <div>
            <RegisterForm setUsername={setUsername} />
        </div>
    )
}
