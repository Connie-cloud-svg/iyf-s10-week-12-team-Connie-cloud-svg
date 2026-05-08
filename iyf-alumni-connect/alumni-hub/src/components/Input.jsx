import { useId } from "react";
const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error = '',
  hint = '',
  required = false,
  disabled = false,
  className = '',
  name,
  id,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || name || generatedId;
  const hasError = !!error;

  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className={`input-label ${required ? 'input-label-required' : ''}`}>
          {label}
        </label>
      )}

      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`input-field ${hasError ? 'input-error' : ''}`}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />

      {hasError && (
        <span id={`${inputId}-error`} className="input-error-message" role="alert">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </span>
      )}

      {hint && !hasError && (
        <span id={`${inputId}-hint`} className="input-hint">
          {hint}
        </span>
      )}
    </div>
  );
};

export default Input;