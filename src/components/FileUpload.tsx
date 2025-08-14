import { useRef, useState } from "react";
import type { CommonProps } from "../utils/types";
import { classNames } from "../utils/classNames";

export function FileUpload({
    id,
    label,
    error,
    required,
    disabled,
    helperText,
    onChange,
    accept,
}: CommonProps & { accept?: string }) {
    const [drag, setDrag] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleFiles = (files: FileList | null) => {
        if (!files || files.length === 0) return;
        onChange?.(files[0]);
    };

    return (
        <div>
            {label && (
                <div className="mb-1 text-sm font-medium">
                    {label} {required && <span className="text-red-500">*</span>}
                </div>
            )}
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setDrag(true);
                }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDrag(false);
                    handleFiles(e.dataTransfer.files);
                }}
                className={classNames(
                    'w-full border-dashed border-2 rounded-md p-4 text-center',
                    drag ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                )}
                onClick={() => inputRef.current?.click()}
                role="button"
                tabIndex={0}
            >
                <div className="text-sm text-gray-600">Drag & drop a file here, or click to browse</div>
                <div className="text-xs text-gray-400 mt-1">{accept ?? 'Any file type'}</div>
                <input ref={inputRef} id={id} type="file" accept={accept} className="hidden" onChange={(e) => handleFiles(e.target.files)} disabled={disabled} />
            </div>
            {helperText && !error && <div className="text-xs text-gray-500 mt-1">{helperText}</div>}
            {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
        </div>
    );
}