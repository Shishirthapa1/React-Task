import { useEffect, useRef, type ReactNode } from "react";
import { classNames } from "../utils/classNames";
import ReactDOM from 'react-dom';

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = 'medium',
    closeOnOverlayClick = true,
    closeOnEscape = true,
}: {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    size?: 'small' | 'medium' | 'large';
    closeOnOverlayClick?: boolean;
    closeOnEscape?: boolean;
}) {
    const nodeRef = useRef<HTMLDivElement | null>(null);
    const previouslyFocused = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (isOpen) {
            previouslyFocused.current = document.activeElement as HTMLElement;
            // lock body scroll
            const overflow = document.documentElement.style.overflow;
            document.documentElement.style.overflow = 'hidden';
            // focus
            requestAnimationFrame(() => nodeRef.current?.focus());
            return () => {
                document.documentElement.style.overflow = overflow;
                previouslyFocused.current?.focus();
            };
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (closeOnEscape && e.key === 'Escape') onClose();
            if (e.key === 'Tab') {
                // naive focus trap
                const focusables = nodeRef.current?.querySelectorAll<HTMLElement>(
                    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
                );
                if (!focusables || focusables.length === 0) return;
                const first = focusables[0];
                const last = focusables[focusables.length - 1];
                if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, closeOnEscape, onClose]);

    if (!isOpen) return null;

    const sizeClass = size === 'small' ? 'max-w-md' : size === 'large' ? 'max-w-4xl' : 'max-w-2xl';

    return ReactDOM.createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
            aria-label={title ?? 'Dialog'}
        >
            <div
                className="absolute inset-0 bg-black/50"
                onMouseDown={(e) => {
                    if (closeOnOverlayClick && e.target === e.currentTarget) onClose();
                }}
            />

            <div
                ref={nodeRef}
                className={classNames('relative w-full mx-auto rounded-lg bg-white shadow-lg p-4 transform transition-all', sizeClass)}
                tabIndex={-1}
            >
                <div className="flex items-start justify-between">
                    <h3 className="text-lg font-medium">{title}</h3>
                    <button aria-label="Close modal" onClick={onClose} className="p-1 rounded hover:bg-gray-100">
                        ✕
                    </button>
                </div>
                <div className="mt-3">{children}</div>
            </div>
        </div>,
        document.body
    );
}