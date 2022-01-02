import axios from "axios";

axios.defaults.withCredentials = true;

export default () => {
  return new Promise((resolve, reject) => {
    axios
      .get("/ssh/servers")
      .then((data) => {
        const res = data.data;
        console.log(res);
        if (res.type === "success") {
          return resolve(res.machines);
        }
        // Login succeeded!
        reject(res.message);
      })
      .catch((err) => {
        console.error("Error occurred");
        console.dir(err);
        const errorData = err.response.data;
        if (errorData) {
          const { message } = errorData;
          return reject(message);
        }
        reject(err);
        // setLoginErrorMessage(err.message);
      });
  });
};
