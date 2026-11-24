import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
const apiRootUrl = apiUrl.replace(/\/api\/v1\/?$/, "");

export async function inicializarCsrf() {
    await axios.get(`${apiRootUrl}/sanctum/csrf-cookie`, {
        headers: {
            Accept: "application/json",
        },
        withCredentials: true,
        withXSRFToken: true,
    });
}

const api = axios.create({
    baseURL: apiUrl,
    headers: {
        Accept: "application/json",
    },
    withCredentials: true,
    withXSRFToken: true,
});

export default api;
