import { createContext, useReducer, useContext, useEffect, useRef } from "react";
import { cartReducer, initialState } from "./cartReducer";
import type { CartAction, CartItem, CartState } from "./cartTypes";

type CartAPI = {
    state: CartState;
    dispatch: React.Dispatch<CartAction>;
    addToCart: (item: CartItem) => Promise<void>;
    removeItem: (id: string) => Promise<void>;
    updateQuantity: (id: string, quantity: number) => Promise<void>;
    applyDiscount: (code: string) => Promise<void>;
    undo: () => void;
};

const CartContext = createContext<CartAPI | null>(null);

// Simulated server call (sometimes fails) for optimistic updates
function simulateServer<T>(payload: T): Promise<T> {
    return new Promise((resolve, reject) => {
        const latency = 300 + Math.random() * 500;
        setTimeout(() => {
            // 15% failure rate
            if (Math.random() < 0.15) reject(new Error("Network error. Please try again."));
            else resolve(payload);
        }, latency);
    });
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, initialState);
    const lastStable = useRef<CartState>(state);

    // Load persisted state
    useEffect(() => {
        const saved = localStorage.getItem("cartState");
        if (saved) {
            try {
                const parsed: CartState = JSON.parse(saved);
                dispatch({ type: "LOAD_CART", payload: parsed });
                lastStable.current = parsed;
            } catch { }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Persist on change
    useEffect(() => {
        localStorage.setItem("cartState", JSON.stringify(state));
        // save only if no errors and not loading as "stable"
        if (!state.isLoading && state.errors.length === 0) {
            lastStable.current = state;
        }
    }, [state]);

    // Optimistic wrappers with error recovery + undo
    const addToCart = async (item: CartItem) => {
        dispatch({ type: "ADD_ITEM", payload: item });
        try {
            dispatch({ type: "SET_LOADING", payload: true });
            await simulateServer(item);
            dispatch({ type: "SET_LOADING", payload: false });
        } catch (e: any) {
            dispatch({ type: "SET_LOADING", payload: false });
            dispatch({ type: "SET_ERRORS", payload: [e.message] });
            dispatch({ type: "UNDO" });
        }
    };

    const removeItem = async (id: string) => {
        dispatch({ type: "REMOVE_ITEM", payload: id });
        try {
            dispatch({ type: "SET_LOADING", payload: true });
            await simulateServer({ id });
            dispatch({ type: "SET_LOADING", payload: false });
        } catch (e: any) {
            dispatch({ type: "SET_LOADING", payload: false });
            dispatch({ type: "SET_ERRORS", payload: [e.message] });
            dispatch({ type: "UNDO" });
        }
    };

    const updateQuantity = async (id: string, quantity: number) => {
        dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
        try {
            dispatch({ type: "SET_LOADING", payload: true });
            await simulateServer({ id, quantity });
            dispatch({ type: "SET_LOADING", payload: false });
        } catch (e: any) {
            dispatch({ type: "SET_LOADING", payload: false });
            dispatch({ type: "SET_ERRORS", payload: [e.message] });
            dispatch({ type: "UNDO" });
        }
    };

    const applyDiscount = async (code: string) => {
        dispatch({ type: "APPLY_DISCOUNT", payload: code }); // realtime calc as user types
        try {
            dispatch({ type: "SET_LOADING", payload: true });
            await simulateServer({ code });
            dispatch({ type: "SET_LOADING", payload: false });
        } catch (e: any) {
            dispatch({ type: "SET_LOADING", payload: false });
            dispatch({ type: "SET_ERRORS", payload: [e.message] });
            // keep the discount change but inform user; or undo if you prefer:
            // dispatch({ type: "UNDO" });
        }
    };

    const undo = () => dispatch({ type: "UNDO" });

    return (
        <CartContext.Provider value={{ state, dispatch, addToCart, removeItem, updateQuantity, applyDiscount, undo }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
}
