import { useEffect, useRef, useState } from "react";
import type { CommonProps } from "../utils/types";
import { classNames } from "../utils/classNames";

export function SelectInput<T>({
    id,
    label,
    error,
    required,
    disabled,
    helperText,
    onChange,
    options = [],
    searchable = true,
    value,
}: CommonProps & {
    options?: { value: string; label: string }[];
    searchable?: boolean;
    value?: string | null;
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const filtered = options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()));
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const onDoc = (e: MouseEvent) => {
            if (!ref.current) return;
            if (!ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('click', onDoc);
        return () => document.removeEventListener('click', onDoc);
    }, []);

    return (
        <div className="relative" ref={ref}>
            {label && (
                <div className="mb-1 text-sm font-medium">
                    {label} {required && <span className="text-red-500">*</span>}
                </div>
            )}
            <button
                type="button"
                className={classNames('w-full text-left px-3 py-2 rounded-md border', error ? 'border-red-400' : 'border-gray-300')}
                onClick={() => setOpen((s) => !s)}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                {options.find((o) => o.value === value)?.label ?? 'Select...'}
            </button>
            {open && (
                <div className="absolute z-20 mt-2 w-full bg-white border rounded-md shadow max-h-56 overflow-auto p-2">
                    {searchable && (
                        <input
                            className="w-full px-2 py-1 border rounded mb-2"
                            placeholder="Search..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    )}
                    <ul role="listbox">
                        {filtered.map((o) => (
                            <li key={o.value}>
                                <button
                                    type="button"
                                    className="w-full text-left px-2 py-1 rounded hover:bg-gray-100"
                                    onClick={() => {
                                        onChange?.(o.value);
                                        setOpen(false);
                                    }}
                                >
                                    {o.label}
                                </button>
                            </li>
                        ))}
                        {filtered.length === 0 && <div className="text-sm text-gray-500 p-2">No options</div>}
                    </ul>
                </div>
            )}
            {helperText && !error && <div className="text-xs text-gray-500 mt-1">{helperText}</div>}
            {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
        </div>
    );
}