import axios, { AxiosError, isAxiosError } from "axios";
import { configKeys } from "./config";
import { paymentEncryption, paymentDecryption } from "./encryption";
import storage from "./storage";

const buildExtraParams = () => {
    const user = storage.getUser();
    return {
        username: user?.username,
        region: user?.region,
        deviceType: "web",
        accountType: user?.accountType || "member",
    };
};

const paymentAxios = axios.create({
    baseURL: `${configKeys.apiHost}/api`,
});

paymentAxios.interceptors.request.use(
    (config) => {
        const token = storage.getToken();

        if (token) {
            config.headers.Authorization = `${token}`;
        }

        const extraParams = buildExtraParams();

        // Add query parameters
        if (config.method?.toLowerCase() === "get") {
            config.params = {
                payload: paymentEncryption({
                    ...extraParams,
                    ...(config.params || {}),
                }),
            };
        }
        const method = config.method?.toLowerCase();
        if (["post", "put"].includes(method || "")) {
            if (config.data instanceof FormData) {
                // Append extraParams to FormData
                Object.entries(extraParams).forEach(([key, value]) => {
                    config.data.append(key, value);
                });
            } else if (
                typeof config.data === "object" &&
                config.data !== null
            ) {
                config.data = paymentEncryption({
                    ...extraParams,
                    ...config.data,
                });
                config.headers["Content-Type"] = "text/plain";
            }
        }

        return config;
    },
    (error) => {
        console.log(error);
        return Promise.reject(error);
    }
);

paymentAxios.interceptors.response.use(
    (response) => {
        if (response?.status === 403) {
            localStorage.clear();
            window.location.href = "/";
        }
        let reponseData;
        try {
            reponseData = paymentDecryption(response?.data);
        } catch (err) {
            reponseData = response?.data;
        }
        response.data = reponseData;
        return response.data;
    },
    async (error) => {
        console.log(error.response);
        if (error.response?.status === 403) {
            localStorage.clearAll(); // Clear the session storage (logout)
            window.location.href = "/"; // Redirect to login page
            // toast.error("Unauthorized");
            return Promise.reject(error);
        }
        if (isAxiosError(error) && error.response) {
            if (typeof error.response.data === "string") {
                error.response.data = paymentDecryption(error.response.data);
            }
        }

        return Promise.reject(error);
    }
);

export default paymentAxios;
