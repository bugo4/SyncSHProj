import React from "react";
import { useState, useEffect } from "react";

import logo from "./icon.png";
import "./LoginForm.css";
import FormInput from "./FormInput";

import LoginControls from "./LoginControls";
import { useNavigate } from "react-router-dom";
import { Alert } from "@material-ui/lab";

function checkIfEmpty(...fields) {
  for (let i = 0; i < fields.length; i++) {
    if (!fields[i]) return true;
  }
  return false;
}

const LoginFieldKeys = {
  username: "username",
  password: "password",
};

export default function LoginForm({ setUsername }) {
  const [LoginFields, setLoginFields] = useState({
    [LoginFieldKeys.username]: "",
    [LoginFieldKeys.password]: "",
  });
  const [submitError, setSubmitError] = useState("");
  let navigate = useNavigate()

  useEffect(() => {
    // Can be vulnerable to XSS... NO XSS Can happen if this feature is on...
    // LoginControls.performAutomaticLogin(setUsername);
    LoginControls.checkIfUserIsLoggedIn()
    .then((userName) => {
        setUsername(userName)
        navigate("/machines")
    })
    .catch(err => {
      console.error(err)
    })

  }, [])
  function handleSubmitLogin(event) {
    const { username, password } = LoginFields;
    if (checkIfEmpty(username, password)) {
      setSubmitError("Fields are empty...");
    } else {
      console.log("Sending...");
      console.log(`User: ${username}, Password: ${password}`);

      LoginControls.sendLoginRequest(username, password)
        .then(() => {
          setUsername(username)
          navigate("/machines")
        })
        .catch((err) => setSubmitError(err));
    }

    event.preventDefault();
  }

  function setLoginField(key, newValue) {
    let newLoginFields = LoginFields;
    newLoginFields[key] = newValue;
    setLoginFields(newLoginFields);
    console.log(LoginFields);
    console.log(LoginFields[LoginFieldKeys.username]);
  }

  return (
    <div className="form-wrapper">
      <form className="form" onSubmit={handleSubmitLogin}>
        <img src={logo} style={{ userSelect: "none", pointerEvents: "none" }} />
        <FormInput
          placeholder={"Username:"}
          fieldName={LoginFieldKeys.username}
          setLoginField={setLoginField}
          fieldValue={LoginFields[LoginFieldKeys.username]}
          inputType="text"
        />
        <FormInput
          placeholder={"Password:"}
          fieldName={LoginFieldKeys.password}
          setLoginField={setLoginField}
          fieldValue={LoginFields[LoginFieldKeys.password]}
          inputType="password"
        />
        <button>Submit</button>
        {submitError && <Alert severity="error">{submitError}</Alert>}
      </form>
    </div>
  );
}
