export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export type Totals = {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
};

export type CartState = {
  items: CartItem[];
  discountCode: string;
  discountAmount: number;
  totals: Totals;
  isLoading: boolean;
  errors: string[];
  undoStack: CartState[];
};

export type CartAction =
  | { type: "LOAD_CART"; payload: CartState }
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "APPLY_DISCOUNT"; payload: string }
  | { type: "CLEAR_ERRORS" }
  | { type: "UNDO" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERRORS"; payload: string[] };
