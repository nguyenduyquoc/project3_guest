import api from './api';

export const postOrder = async (orderData) => {
    const endpoint = `Order/post`;
    try {
        const response = await api.post(endpoint, orderData);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const patchConfirmOrderPayment = async (code) => {
    const endpoint = `Order/confirm_payment/${code}`;
    try {
        const response = await api.patch(endpoint);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}