import type { CartItem } from "../../cart/cartTypes";

export type Product = {
    id: string;
    name: string;
    price: number;
    image: string;
};

export function ProductGrid({
    products,
    onAddToCart,
}: {
    products: Product[];
    onAddToCart: (item: CartItem) => void;
}) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
                <div key={p.id} className="bg-white rounded-xl shadow-sm border p-4 flex flex-col">
                    <img src={p.image} alt={p.name} className="h-44 object-contain mb-3 rounded" />
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{p.name}</h3>
                        <p className="text-indigo-700 font-bold mt-1">${p.price.toFixed(2)}</p>
                    </div>
                    <button
                        className="mt-4 w-full rounded-lg bg-indigo-600 text-white py-2 hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        onClick={() =>
                            onAddToCart({ id: p.id, name: p.name, price: p.price, image: p.image, quantity: 1 })
                        }
                    >
                        Add to Cart
                    </button>
                </div>
            ))}
        </div>
    );
}
