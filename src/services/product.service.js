import api from './api';

export const getProducts = async (filterCriteria) => {
    const endpoint = `Product/get_all_products`;
    try {
        const response = await api.post(endpoint, filterCriteria);
        return response.data;
    } catch (error) {
        console.error('Error fetching filtered products:', error);
        throw error;
    }
}

export const getProductDetail = async (slug) => {
    const endpoint = `Product/get_by_slug/${slug}`;
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.error('Error fetching filtered products:', error);
        throw error;
    }
}
export const getPublishYears = async () => {
    const endpoint = `Product/publish_years`;
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.error('Error fetching publish years:', error);
        throw error;
    }
}