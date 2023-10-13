import api from './api';

export const getCategories = async (limit) => {
    const endpoint = `Category/get_categories_1`;
    try {
        const response = await api.get(endpoint, { params: {limit} });
        return response.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}
