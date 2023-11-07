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

    const [address, setAddress] = useState("");
    const [selectedProvinceId, setSelectedProvinceId] = useState(null);
    const [selectedDistrictId, setSelectedDistrictId] = useState(null);
    const [selectedDeliveryServiceId, setSelectedDeliveryServiceId] = useState(null);
    const [selectedService, setSelectedService] = useState(null);

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
        if (selectedDeliveryServiceId) {
            // Find the selected province
            const selectedProvince = provinces.find((province) => province.id === selectedProvinceId);
            if (selectedProvince) {
                // Find the selected district within the province
                const selectedDistrict = selectedProvince.districts.find((district) => district.id === selectedDistrictId);
                if (selectedDistrict) {
                    //Find the selected delivery service within the district
                    const selectedDeliveryService = selectedDistrict.deliveryServices.find((deliveryService) => deliveryService.id === selectedDeliveryServiceId);
                    if (selectedDeliveryService) {
                        // Set the deliveryFee based on the selected district
                        setSelectedService(selectedDeliveryService);
                        return;
                    }
                }
            }
        }
        // If no delivery service selected or not found, set deliveryFee to null
        setSelectedService(null);

    }, [selectedDeliveryServiceId]);


    return (
        <ProvinceContext.Provider
            value={{
                provinces,
                address, setAddress,
                selectedProvinceId,
                selectedDistrictId,
                setSelectedProvinceId,
                setSelectedDistrictId,
                selectedDeliveryServiceId, setSelectedDeliveryServiceId,
                selectedService
            }}
        >
            {children}
        </ProvinceContext.Provider>
    );
}
