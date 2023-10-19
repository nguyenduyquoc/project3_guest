import React, { createContext, useReducer, useContext } from 'react';

const LoadingContext = createContext();

const initialState = {
    isLoading: false,
};

const loadingReducer = (state, action) => {
    switch (action.type) {
        case 'START_LOADING':
            return { isLoading: true };
        case 'STOP_LOADING':
            return { isLoading: false };
        default:
            return state;
    }
};

const LoadingProvider = ({ children }) => {
    const [state, dispatch] = useReducer(loadingReducer, initialState);

    return (
        <LoadingContext.Provider value={{ loadingState: state, loadingDispatch: dispatch }}>
            {children}
        </LoadingContext.Provider>
    );
};

const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};

export { LoadingProvider, useLoading };