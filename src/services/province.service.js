import api from "./api";


export const getProvinces = async () => {
    const endpoint = `Province/get_provinces`;
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}
