import { useId, type InputHTMLAttributes } from 'react';

/** Figma component: Plantrust/Field, with a visible label and an optional hint or error. */
interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

export function Field({ label, hint, error, id, className = '', ...props }: FieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;
  const message = error ?? hint;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-label">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        className={`min-h-12 rounded-control border border-border bg-surface px-4 py-3 text-control text-ink placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand aria-invalid:border-red-700 ${className}`}
        {...props}
      />
      {message && (
        <p id={messageId} className={`text-caption ${error ? 'text-red-700' : 'text-muted'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
