import api from './api';

export const getProducts = async (page, pageSize, orderByDescending, search, status) => {
    const endpoint = 'product';
    try {
        const response = await api.get(endpoint, { params: { page, pageSize, orderByDescending, search, status } });
        return response.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const getProductDetail = async (slug) => {
    const endpoint = `product/slug/${slug}`;
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.log(error);
        return {};
    }
}