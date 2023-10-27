import React, {createContext, useContext, useEffect, useState} from 'react';
import { useAuth } from './AuthContext';
import {getProfile} from "../services/auth.service";
import {useLoading} from "./LoadingContext"; // Import the AuthContext

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const { loadingDispatch } = useLoading();
    const { authState } = useAuth();
    const [user, setUser] = useState(null);

    useEffect(() => {
        console.log("set user after token change");
        if (authState.token) {
            getUserFromToken();
        } else {
            setUser(null);
        }
    }, [authState.token]);

    const getUserFromToken = async () => {
        try {
            loadingDispatch({type: 'START_LOADING'});
            const response = await getProfile();
            console.log("User: ", response);
            setUser(response);
        } catch (error) {
            console.log('Error fetching user profile:', error);
        } finally {
            loadingDispatch({type: 'STOP_LOADING'});
        }
    }

    return (
        <UserContext.Provider value={{ user , getUserFromToken}}>
            {children}
        </UserContext.Provider>
    );
};

const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export { UserProvider, useUser };