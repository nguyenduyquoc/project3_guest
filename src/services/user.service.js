import api from './api';

export const updateUserProfile = async (updateData) => {
    const endpoint = `User/update_profile`;
    try {
        const response = await api.put(endpoint, updateData);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


