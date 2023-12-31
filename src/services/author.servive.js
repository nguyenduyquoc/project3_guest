import api from './api';

export const getAuthors = async () => {
    const endpoint = `Author/get_authors`;
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getAuthor = async () => {
    const endpoint = `Author/get_by_id`;
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}