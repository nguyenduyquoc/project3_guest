import api from './api';

export const getCouponByCode = async (code) => {
    const endpoint = `Coupon/get_by_code/${code}`;
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}