import { classNames } from "../utils/classNames";
import type { CommonProps } from "../utils/types";

export function TextInput({
    id,
    label,
    error,
    required,
    disabled,
    helperText,
    onChange,
    ...rest
}: CommonProps & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <label className="block">
            {label && (
                <div className="mb-1 text-sm font-medium">
                    {label} {required && <span className="text-red-500">*</span>}
                </div>
            )}
            <input
                id={id}
                className={classNames(
                    'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring',
                    error ? 'border-red-400' : 'border-gray-300',
                    disabled ? 'opacity-60 cursor-not-allowed' : ''
                )}
                disabled={disabled}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
                onChange={(e) => onChange?.(e.target.value)}
                {...rest}
            />
            {helperText && !error && <div id={`${id}-helper`} className="text-xs text-gray-500 mt-1">{helperText}</div>}
            {error && <div id={`${id}-error`} className="text-xs text-red-600 mt-1">{error}</div>}
        </label>
    );
}