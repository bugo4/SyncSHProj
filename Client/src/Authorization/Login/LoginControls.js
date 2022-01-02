import axios from "axios";


axios.defaults.withCredentials = true;

function getCookieValue(keyName) {
  return document.cookie
    ?.split("; ")
    ?.find((row) => row.startsWith(`${keyName}=`))
    ?.split("=")[1];
}

export default {
  sendLoginRequest: (username, password) => {
    return new Promise((resolve, reject) => {
      axios
        .post("/login", { username, password })
        .then((data) => {
          const res = data.data;
          console.log(res);
          if (res.type === "error") {
            //   setLoginErrorMessage(res.error);
            reject(res.message);
          }
          // Login succeeded!
          console.log(`Login Succeeded! ${res.message}`);
          resolve();
        })
        .catch((err) => {
          console.error("Error occurred");
          console.dir(err);
          const errorData = err.response.data 
          if (errorData) {
            console.log(errorData)
                return reject(errorData)
          }
          reject(err);
          // setLoginErrorMessage(err.message);
        });
    });
  },
  checkIfUserIsLoggedIn: (username, password) => {
    return new Promise((resolve, reject) => {
      axios
        .get("/isLoggedIn")
        .then((data) => {
          const res = data.data;
          console.log(res);
          if (res.type === "error") {
            //   setLoginErrorMessage(res.error);
            return reject(res.message);
          }
          // Login succeeded!
          const {userName} = res
          console.log(`Login Succeeded! ${userName}`);
          resolve(userName);
        })
        .catch((err) => {
          console.error("Error occurred");
          console.dir(err);
          const errorData = err.response.data 
          if (errorData) {
            console.log(errorData)
                return reject(errorData)
          }
          reject(err);
          // setLoginErrorMessage(err.message);
        });
    });
  },
  
  performAutomaticLogin(setUsername) {
    



    const CachedUsername = getCookieValue("username");
    const CachedPassword = getCookieValue("password");
    if (CachedUsername && CachedPassword) {
      this.sendLoginRequest(CachedUsername, CachedPassword)
        .then(() => {
          console.log("Found User+Password!");
          console.log(`User: ${CachedUsername}, Password: ${CachedPassword}`);
          setUsername(CachedUsername);
        })
        .catch((err) => {
          alert(err);
          document.cookie = ""
        });
      return true;
    }
    return false;
  },
};
