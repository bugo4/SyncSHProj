import { Button, Icon, IconButton } from "@material-ui/core";
import React from "react";

import LogoutIcon from "../../../../assets/logout_icon.png"

import { useNavigate } from "react-router-dom";

import axios from 'axios'

export default function LogoutButton() {
  let navigate = useNavigate()

    const pngIcon = (
        <Icon>
          <img alt="logout" src={LogoutIcon} style={{width: "100%"}}  />
        </Icon>
    )
    function handleLogout(event) {
        axios.get("/logout")
        .then(data => {
            navigate("/")
        })
        .catch(err => {
            console.error(err)
        })
    }
    return (
        <IconButton
        onClick={handleLogout}
        title={"Log out"}
        variant={"contained"}
        color="primary"
    >
        {pngIcon}
        </IconButton>
    );
}
