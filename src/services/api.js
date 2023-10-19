import axios from "axios";
const BASE_URL = "https://localhost:7250/api/";

const api = axios.create({
    baseURL: BASE_URL
})

// Add an interceptor to set the authorization header
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Assuming you store the token in local storage
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;