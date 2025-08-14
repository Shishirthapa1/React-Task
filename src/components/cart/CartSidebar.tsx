import { useEffect, useState } from "react";
import type { CartItem, Totals } from "../../cart/cartTypes";

export function CartSidebar({
    isOpen,
    items,
    totals,
    discountCode,
    errors,
    isLoading,
    onClose,
    onUpdateQuantity,
    onRemoveItem,
    onApplyDiscount,
    onCheckout,
    onUndo,
}: {
    isOpen: boolean;
    items: CartItem[];
    totals: Totals;
    discountCode: string;
    errors: string[];
    isLoading: boolean;
    onClose: () => void;
    onUpdateQuantity: (id: string, quantity: number) => void;
    onRemoveItem: (id: string) => void;
    onApplyDiscount: (code: string) => void; // realtime as user types
    onCheckout: () => void;
    onUndo: () => void;
}) {
    const [code, setCode] = useState(discountCode);

    useEffect(() => setCode(discountCode), [discountCode]);

    useEffect(() => {
        onApplyDiscount(code); // realtime calculation while typing
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code]);

    if (!isOpen) return null;

    return (
        <aside
            className="fixed top-0 right-0 w-96 max-w-full h-full bg-white shadow-2xl border-l z-50 flex flex-col"
            role="dialog"
            aria-label="Shopping cart"
        >
            <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Your Cart</h2>
                <button
                    onClick={onClose}
                    className="p-2 rounded hover:bg-gray-100"
                    aria-label="Close cart sidebar"
                >
                    ✕
                </button>
            </div>

            {!!errors.length && (
                <div className="mx-4 mt-4 bg-red-50 text-red-700 border border-red-200 rounded p-3">
                    {errors.map((e, i) => (
                        <div key={i}>{e}</div>
                    ))}
                    <div className="mt-2 text-sm">You can also try <button className="underline" onClick={onUndo}>Undo</button>.</div>
                </div>
            )}

            <div className="flex-1 overflow-auto p-4 space-y-4">
                {items.length === 0 && <p className="text-gray-600">Your cart is empty.</p>}

                {items.map(({ id, name, price, quantity, image }) => (
                    <div key={id} className="flex gap-3 border-b pb-3">
                        <img src={image} alt={name} className="w-16 h-16 object-contain rounded" />
                        <div className="flex-1">
                            <p className="font-medium text-gray-900">{name}</p>
                            <p className="text-sm text-gray-600">${price.toFixed(2)}</p>

                            <div className="mt-2 flex items-center gap-2">
                                <button
                                    className="px-2 py-1 rounded border hover:bg-gray-50 disabled:opacity-40"
                                    onClick={() => onUpdateQuantity(id, Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                    aria-label={`Decrease quantity of ${name}`}
                                >
                                    –
                                </button>
                                <input
                                    type="number"
                                    min={1}
                                    value={quantity}
                                    onChange={(e) => onUpdateQuantity(id, Math.max(1, Number(e.target.value) || 1))}
                                    className="w-14 text-center border rounded py-1"
                                    aria-label={`Quantity of ${name}`}
                                />
                                <button
                                    className="px-2 py-1 rounded border hover:bg-gray-50"
                                    onClick={() => onUpdateQuantity(id, quantity + 1)}
                                    aria-label={`Increase quantity of ${name}`}
                                >
                                    +
                                </button>

                                <button
                                    className="ml-auto text-red-600 hover:text-red-700"
                                    onClick={() => onRemoveItem(id)}
                                    aria-label={`Remove ${name}`}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t space-y-3">
                <div>
                    <label htmlFor="discount" className="block text-sm font-medium">Discount Code</label>
                    <input
                        id="discount"
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="mt-1 w-full border rounded px-3 py-2"
                        placeholder="e.g. SAVE10"
                    />
                </div>

                <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span>Subtotal</span><span>${totals.subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Tax</span><span>${totals.tax.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Shipping</span><span>${totals.shipping.toFixed(2)}</span></div>
                </div>

                <div className="flex justify-between text-base font-semibold border-t pt-2">
                    <span>Total</span>
                    <span>${totals.total.toFixed(2)}</span>
                </div>

                <button
                    disabled={items.length === 0 || isLoading}
                    onClick={onCheckout}
                    className="w-full mt-2 rounded-lg bg-indigo-600 text-white py-2 hover:bg-indigo-700 disabled:opacity-50"
                >
                    {isLoading ? "Processing..." : "Checkout"}
                </button>
            </div>
        </aside>
    );
}
