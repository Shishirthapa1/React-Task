import type { CartAction, CartItem, CartState, Totals } from "./cartTypes";

const TAX_RATE = 0.1; // 10%
const SHIPPING_FLAT = 5; // flat fee

export const initialState: CartState = {
  items: [],
  discountCode: "",
  discountAmount: 0,
  totals: { subtotal: 0, tax: 0, shipping: 0, total: 0 },
  isLoading: false,
  errors: [],
  undoStack: [],
};

function calcTotals(items: CartItem[], discountAmount: number): Totals {
  const subtotal = +items
    .reduce((sum, i) => sum + i.price * i.quantity, 0)
    .toFixed(2);
  const tax = +(subtotal * TAX_RATE).toFixed(2);
  const shipping = items.length > 0 ? SHIPPING_FLAT : 0;
  const total = Math.max(
    0,
    +(subtotal + tax + shipping - discountAmount).toFixed(2)
  );
  return { subtotal, tax, shipping, total };
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "LOAD_CART":
      return action.payload;

    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.id === action.payload.id);
      const items = existing
        ? state.items.map((i) =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + action.payload.quantity }
              : i
          )
        : [...state.items, action.payload];
      return {
        ...state,
        undoStack: [state, ...state.undoStack],
        items,
        totals: calcTotals(items, state.discountAmount),
        errors: [],
      };
    }

    case "REMOVE_ITEM": {
      const items = state.items.filter((i) => i.id !== action.payload);
      return {
        ...state,
        undoStack: [state, ...state.undoStack],
        items,
        totals: calcTotals(items, state.discountAmount),
        errors: [],
      };
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;
      if (quantity < 1) return state;
      const items = state.items.map((i) =>
        i.id === id ? { ...i, quantity } : i
      );
      return {
        ...state,
        undoStack: [state, ...state.undoStack],
        items,
        totals: calcTotals(items, state.discountAmount),
        errors: [],
      };
    }

    case "APPLY_DISCOUNT": {
      const code = action.payload.trim();
      let discountAmount = 0;
      const errors: string[] = [];

      // Demo rules
      if (!code) {
        discountAmount = 0;
      } else if (code.toUpperCase() === "SAVE10") {
        discountAmount = 10;
      } else if (code.toUpperCase() === "HALFOFF") {
        discountAmount = +(calcTotals(state.items, 0).subtotal * 0.5).toFixed(
          2
        );
      } else {
        errors.push("Invalid discount code");
      }

      return {
        ...state,
        undoStack: [state, ...state.undoStack],
        discountCode: code,
        discountAmount,
        totals: calcTotals(state.items, discountAmount),
        errors,
      };
    }

    case "CLEAR_ERRORS":
      return { ...state, errors: [] };

    case "UNDO":
      if (state.undoStack.length === 0) return state;
      return { ...state.undoStack[0], undoStack: state.undoStack.slice(1) };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_ERRORS":
      return { ...state, errors: action.payload };

    default:
      return state;
  }
}
