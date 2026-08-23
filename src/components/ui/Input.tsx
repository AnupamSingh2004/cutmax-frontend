import { type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, forwardRef } from "react";

const FIELD_CLASSES =
  "w-full rounded-2xl border border-border bg-white px-4 py-2.5 text-sm text-navy-900 placeholder:text-muted focus:border-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-700/15";

interface FieldWrapperProps {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & FieldWrapperProps>(
  function Input({ label, error, className = "", id, ...props }, ref) {
    return (
      <label className="flex flex-col gap-1.5 text-sm">
        {label && <span className="font-medium text-navy-800">{label}</span>}
        <input ref={ref} id={id} className={`${FIELD_CLASSES} ${className}`} {...props} />
        {error && <span className="text-xs text-red-600">{error}</span>}
      </label>
    );
  },
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & FieldWrapperProps>(
  function Textarea({ label, error, className = "", ...props }, ref) {
    return (
      <label className="flex flex-col gap-1.5 text-sm">
        {label && <span className="font-medium text-navy-800">{label}</span>}
        <textarea ref={ref} className={`${FIELD_CLASSES} min-h-24 resize-y ${className}`} {...props} />
        {error && <span className="text-xs text-red-600">{error}</span>}
      </label>
    );
  },
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & FieldWrapperProps>(
  function Select({ label, error, className = "", children, ...props }, ref) {
    return (
      <label className="flex flex-col gap-1.5 text-sm">
        {label && <span className="font-medium text-navy-800">{label}</span>}
        <select ref={ref} className={`${FIELD_CLASSES} ${className}`} {...props}>
          {children}
        </select>
        {error && <span className="text-xs text-red-600">{error}</span>}
      </label>
    );
  },
);
