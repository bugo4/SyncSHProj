import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

export default function ProtectedRoute({username}) {
    return (
        username ? <Outlet/> : <Navigate to="/login"/>
    )
}
