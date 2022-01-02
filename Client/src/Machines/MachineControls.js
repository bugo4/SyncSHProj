import axios from "axios";


axios.defaults.withCredentials = true;

export default {
    getMachinesList() {
        return new Promise((resolve, reject) => {
            axios
              .get("/machines")
              .then((data) => {
                const res = data.data;
                console.log(res);
                resolve(res)
              })
              .catch((err) => {
                console.error("Error occurred");
                console.dir(err);
                const errorData = err.response.data 
                if (errorData) {
                      const {message} = errorData;
                      return reject(message)
                }
                reject(err);
                // setLoginErrorMessage(err.message);
              });
          });
    },
}