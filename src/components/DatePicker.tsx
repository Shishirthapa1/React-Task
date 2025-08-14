import { classNames } from "../utils/classNames";
import type { CommonProps } from "../utils/types";

export function DatePicker({
    id,
    label,
    error,
    required,
    disabled,
    helperText,
    onChange,
    value,
}: CommonProps & { value?: string | null }) {
    // simple datepicker using native date input for accessibility
    return (
        <div>
            {label && (
                <div className="mb-1 text-sm font-medium">
                    {label} {required && <span className="text-red-500">*</span>}
                </div>
            )}
            <input
                id={id}
                type="date"
                value={value ?? ''}
                onChange={(e) => onChange?.(e.target.value)}
                disabled={disabled}
                className={classNames('w-full px-3 py-2 border rounded-md', error ? 'border-red-400' : 'border-gray-300')}
                aria-invalid={!!error}
            />
            {helperText && !error && <div className="text-xs text-gray-500 mt-1">{helperText}</div>}
            {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
        </div>
    );
}