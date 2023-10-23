import api from "./api";

export const getPublishers = async () => {
    const endpoint = `Publisher/get_publisher`;
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}