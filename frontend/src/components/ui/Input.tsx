import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium text-text-secondary">{label}</label>}
      <input
        className={`w-full px-4 py-3 rounded-2xl bg-beige-50 border border-beige-200 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-coral focus:border-transparent transition-all ${error ? 'border-red-400' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
