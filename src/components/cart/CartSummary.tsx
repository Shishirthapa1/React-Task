import type { Totals } from "../../cart/cartTypes";

export function CartSummary({
    subtotal,
    tax,
    shipping,
    discount,
    total,
}: {
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    total: number;
}) {
    return (
        <div className="bg-white rounded-xl shadow-sm border p-4 space-y-2">
            <h3 className="text-lg font-semibold">Order Summary</h3>
            <div className="text-sm space-y-1">
                <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
                <div className="flex justify-between text-green-700">
                    <span>Discount</span><span>- ${discount.toFixed(2)}</span>
                </div>
            </div>
            <div className="flex justify-between text-base font-semibold border-t pt-2">
                <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
        </div>
    );
}
