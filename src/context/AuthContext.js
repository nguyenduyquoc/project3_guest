import React, {createContext, useReducer, useContext, useEffect} from 'react';

const AuthContext = createContext();

const initialState = {
    token: null,
    user: null,
};

const authReducer = (state, action) => {
    switch (action.type) {
        case 'SET_TOKEN':
            // Set the token in LocalStorage
            localStorage.setItem('token', action.payload);
            return { ...state, token: action.payload };
        case 'SET_USER':
            return { ...state, user: action.payload };
        case 'LOGOUT':
            // Clear the token from LocalStorage
            localStorage.removeItem('token');
            return { ...state, token: null, user: null };
        case 'LOAD_TOKEN':
            // Retrieve the token from LocalStorage
            const storedToken = localStorage.getItem('token');
            return { ...state, token: storedToken };
        default:
            return state;
    }
};

const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        // Load the token from LocalStorage on app load
        dispatch({ type: 'LOAD_TOKEN' });
    }, []);

    return (
        <AuthContext.Provider value={{ authState: state, authDispatch: dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export { AuthProvider, useAuth };