import axios from "axios";

axios.defaults.withCredentials = true;

export function handleConnectionRequest(accountId) {
    return new Promise((resolve, reject) => {
        axios
            .post("/ssh/client/connect", { accountId })
            .then((data) => {
                const res = data.data;
                if (res.error) {
                    reject(res.error);
                }
                resolve(res);
            })
            .catch((err) => {
                reject(err);
                // setLoginErrorMessage(err.message);
            });
    });
}
