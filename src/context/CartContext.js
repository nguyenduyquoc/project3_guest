import React, { createContext, useReducer, useContext } from 'react';

const CartContext = createContext();

const initialState = {
    cartItems: [],
};

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            const existingItem = state.cartItems.find(
                (item) => item.id === action.payload.product.id
            );
            if (existingItem) {
                // If the gift exists in the cart, update the buy_quantity
                return {
                    ...state,
                    cartItems: state.cartItems.map((item) =>
                        item.id === action.payload.product.id
                            ? { ...item, buy_quantity: item.buy_quantity + action.payload.product.buy_quantity }
                            : item
                    ),
                };
            } else {
                console.log("not existingItem ");
                // If the gift doesn't exist in the cart, add it as a new item
                return {
                    ...state,
                    cartItems: [...state.cartItems, action.payload.product],
                };
            }
        case 'UPDATE_CART_ITEM':
            return {
                ...state,
                cartItems: state.cartItems.map((item) =>
                    item.id === action.payload.productId
                        ? { ...item, buy_quantity: action.payload.buy_quantity }
                        : item
                ),
            };
        case 'REMOVE_CART_ITEM':
            return {
                ...state,
                cartItems: state.cartItems.filter(
                    (item) => item.id !== action.payload.productId
                ),
            };
        case 'CLEAR_CART':
            return {
                ...state,
                cartItems: [],
            };
        default:
            return state;
    }
};

const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    return (
        <CartContext.Provider value={{ cartState: state, cartDispatch: dispatch }}>
            {children}
        </CartContext.Provider>
    );
};

const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export { CartProvider, useCart };