import axios from "axios";
const BASE_URL = "https://localhost:7250/api/";

const api = axios.create({
    baseURL: BASE_URL
})

// Add an interceptor to set the authorization header
api.interceptors.request.use((config) => {
    // Check if the request is for your API
    if (config.baseURL.startsWith(BASE_URL)) {
        const token = localStorage.getItem('token'); // Assuming you store the token in local storage
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;