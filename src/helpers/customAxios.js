import axios, { AxiosError, isAxiosError } from "axios";
import { configKeys } from "./config";
import { encryption, decryption } from "./encryption";
import storage from "./storage";
// import { toast } from "react-toastify";

// interface CustomAxiosRequestConfig extends AxiosRequestConfig {
//     __isRetryRequest?: boolean;
// }

const buildExtraParams = () => {
    const user = storage.getUser();
    return {
        username: user?.username,
        region: user?.region || "NG",
        deviceType: "web",
        accountType: user?.accountType,
        bizFrom: "SMARTDEALS",
    };
};

const customAxios = axios.create({
    baseURL: `${configKeys.apiHost}/api`,
});

customAxios.interceptors.request.use(
    (config) => {
        const token = storage.getToken();

        if (token) {
            config.headers.Authorization = `${token}`;
        }
        const sigmaKey = localStorage.getItem("sigma");
        if (sigmaKey) {
            config.headers["api-sigma-key"] = sigmaKey;
        }
        // api-sigma-key

        const extraParams = buildExtraParams();

        // Add query parameters
        if (config.method?.toLowerCase() === "get") {
            config.params = {
                payload: encryption({
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
                config.data = encryption({
                    ...extraParams,
                    ...config.data,
                });
                config.headers["Content-Type"] = "text/plain";
            }
        }

        return config;
    },
    (error) => {
        console.log(error.response.status);
        return Promise.reject(error);
    }
);

customAxios.interceptors.response.use(
    (response) => {
        if (response?.status === 403 || response?.status === 401) {
            localStorage.clear();
            // if (window.location.pathname.includes("admin")) {
            //     window.location.href = "/admin-login";
            // } else {
            // }
            // window.location.href = "/dashboard";
        }
        let reponseData;
        try {
            reponseData = decryption(response?.data);
        } catch (err) {
            reponseData = response?.data;
        }
        response.data = reponseData;
        return response.data;
        // return { ...response, data: reponseData };
    },
    async (error) => {
        console.log(error);

        if (error?.status === 403 || error?.status === 401) {
            storage.clearStorage();
            // window.location.href = "/dashboard";

            // toast.error("Unauthorized");
            return Promise.reject(error);
        }

        if (isAxiosError(error) && error.response) {
            if (typeof error.response.data === "string") {
                error.response.data = decryption(error.response.data);
            }
        }

        return Promise.reject(error);
    }
);

export default customAxios;
