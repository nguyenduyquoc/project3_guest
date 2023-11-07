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

export const getLikeProducts = async () => {
    const endpoint = `User/liked_products`;
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const likeOrUnlikeProduct = async (id) => {
    const endpoint = `User/like_product/${id}`;
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getOrderHistory = async () => {
    const endpoint = `User/order_history`;
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getOrderHistoryDetail = async (code) => {
    const endpoint = `User/order_detail/${code}`;
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getReturnRequestHistory = async () => {
    const endpoint = `User/return_request_history`;
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getReturnRequestHistoryDetail = async (id) => {
    const endpoint = `user/return_request/${id}`;
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
