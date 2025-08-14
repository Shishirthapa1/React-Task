import { useState } from "react";
import { CartProvider, useCart } from "../cart/CartContext";
import type { CartItem } from "../cart/cartTypes";
import { ProductGrid } from "../components/cart/ProductGrid";
import { CartSidebar } from "../components/cart/CartSidebar";
import { CartSummary } from "../components/cart/CartSummary";

const PRODUCTS = [
    { id: "p1", name: "Wireless Headphones", price: 59.99, image: "https://via.placeholder.com/200x150?text=Headphones" },
    { id: "p2", name: "Gaming Mouse", price: 39.95, image: "https://via.placeholder.com/200x150?text=Mouse" },
    { id: "p3", name: "Mechanical Keyboard", price: 89.0, image: "https://via.placeholder.com/200x150?text=Keyboard" },
];

function CartDemo() {
    const { state, addToCart, removeItem, updateQuantity, applyDiscount, undo } = useCart();
    const [open, setOpen] = useState(false);

    const handleCheckout = async () => {
        // Simulate checkout: you could POST to an API here
        alert("Checkout complete! (demo)");
    };

    const onAddToCart = async (item: CartItem) => {
        await addToCart(item); // optimistic + error recovery handled in context
        setOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="max-w-6xl mx-auto flex items-center justify-between p-6">
                <h1 className="text-2xl font-bold text-indigo-700">Shop</h1>
                <button
                    onClick={() => setOpen(true)}
                    className="relative px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >
                    Cart
                    <span className="ml-2 bg-white text-indigo-700 rounded-full px-2 py-0.5 text-sm">
                        {state.items.reduce((sum, i) => sum + i.quantity, 0)}
                    </span>
                </button>
            </header>

            <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ProductGrid products={PRODUCTS} onAddToCart={onAddToCart} />
                </div>

                <CartSummary
                    subtotal={state.totals.subtotal}
                    tax={state.totals.tax}
                    shipping={state.totals.shipping}
                    discount={state.discountAmount}
                    total={state.totals.total}
                />
            </main>

            <CartSidebar
                isOpen={open}
                onClose={() => setOpen(false)}
                items={state.items}
                totals={state.totals}
                discountCode={state.discountCode}
                errors={state.errors}
                isLoading={state.isLoading}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
                onApplyDiscount={applyDiscount}
                onCheckout={handleCheckout}
                onUndo={undo}
            />
        </div>
    );
}

export default function CartPage() {
    return (
        <CartProvider>
            <CartDemo />
        </CartProvider>
    );
}
