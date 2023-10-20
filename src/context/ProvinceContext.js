import React, { createContext, useContext, useEffect, useState } from 'react';
import {useLoading} from "./LoadingContext";
import {getProvinces} from "../services/province.service";

const ProvinceContext = createContext();

export function useProvinces() {
    return useContext(ProvinceContext);
}

export function ProvinceProvider({ children }) {
    const { loadingDispatch } = useLoading();
    const [provinces, setProvinces] = useState([]);
    const [selectedProvinceId, setSelectedProvinceId] = useState(null);
    const [selectedDistrictId, setSelectedDistrictId] = useState(null);
    const [deliveryFee, setDeliveryFee] = useState(null);

    useEffect(() => {
        fetchProvinces();
    }, []);

    const fetchProvinces = async () => {
        try {
            loadingDispatch({type: 'START_LOADING'});
            const data = await getProvinces();
            setProvinces(data);
        } catch (error) {
            console.error('Error fetching provinces:', error);
        } finally {
            loadingDispatch({type: 'STOP_LOADING'});
        }
    };

    // Calculate delivery fee based on selectedProvinceId and selectedDistrictId
    useEffect(() => {
        if (selectedDistrictId) {
            // Find the selected province
            const selectedProvince = provinces.find((province) => province.id === selectedProvinceId);
            if (selectedProvince) {
                // Find the selected district within the province
                const selectedDistrict = selectedProvince.districts.find((district) => district.id === selectedDistrictId);
                if (selectedDistrict) {
                    // Set the deliveryFee based on the selected district
                    setDeliveryFee(selectedDistrict.deliveryFee);
                    return;
                }
            }
        }
        // If no district selected or not found, set deliveryFee to null
        setDeliveryFee(null);
    }, [selectedDistrictId, provinces, selectedProvinceId]);

    return (
        <ProvinceContext.Provider
            value={{
                provinces,
                selectedProvinceId,
                selectedDistrictId,
                setSelectedProvinceId,
                setSelectedDistrictId,
                deliveryFee
            }}
        >
            {children}
        </ProvinceContext.Provider>
    );
}
