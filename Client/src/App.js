import logo from "./logo.svg";
import "./App.css";
import LoginForm from "./Authorization/Login/LoginForm";

import { useState } from "react";

// import { useCookies } from 'react-cookie';
// import MachinesContainer from './Machines/MachinesContainer';
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Main from "./Pages/Main";
import Login from "./Pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import Register from "./Pages/Register";

function App() {
    const [username, setUsername] = useState("");

    // const [cookies, setCookie] = useCookies();
    // Automatic login is deprected for now because of XSS Risk -
    // An attacker can inject an XSS code and get the client username and password cookies...
    // Todo: make an automatic login with session / make the server return the username+password cookies.

    // Send a message to the server
    // Server: if the client is logged in, sends a

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route
                path="/login"
                element={<Login setUsername={setUsername} />}
            />
            <Route
                path="/register"
                element={<Register setUsername={setUsername} />}
            />
            <Route element={<ProtectedRoute username={username} />}>
                <Route
                    path="/machines"
                    element={<Main username={username} />}
                />
            </Route>
            {/* username ? (
        <MachinesContainer username={username}/>
    ) : (
        <LoginForm setUsername={setUsername}/>
    ) */}
        </Routes>
    );
}

export default App;
