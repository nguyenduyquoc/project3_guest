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


export const cancelOrder = async (cancelData) => {
    const endpoint = `Order/cancel_order`;
    try {
        const response = await api.post(endpoint, cancelData);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const confirmReceivedOrder = async (confirmData) => {
    const endpoint = `Order/confirm_received_order`;
    try {
        const response = await api.post(endpoint, confirmData);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}