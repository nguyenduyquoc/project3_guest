import api from './api';

export const registerUser = async (userData) => {
    const endpoint = `Auth/register`;
    try {
        const response = await api.post(endpoint, userData);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const loginUser = async (loginData) => {
    const endpoint = `Auth/login`;
    try {
        const response = await api.post(endpoint, loginData);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getProfile = async () => {
    const endpoint = `Auth/profile`;
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const resetPassword = async (passwordData) => {
    const endpoint = 'Auth/reset_password';
    try {
        const response = await api.post(endpoint, passwordData);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};