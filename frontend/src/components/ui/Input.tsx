import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, icon, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-medium text-text-secondary">{label}</label>}
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">{icon}</span>
        )}
        <input
          className={`w-full px-4 py-3 rounded-2xl bg-cream-50 border border-cream-200 
            text-text-primary placeholder:text-text-muted 
            focus:outline-none focus:ring-2 focus:ring-accent-purple/30 focus:border-accent-purple 
            transition-all duration-200
            ${icon ? 'pl-11' : ''}
            ${error ? 'border-accent-red ring-1 ring-accent-red/20' : ''} 
            ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-accent-red flex items-center gap-1">⚠ {error}</p>}
    </div>
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function TextArea({ label, error, className = '', ...props }: TextAreaProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-medium text-text-secondary">{label}</label>}
      <textarea
        className={`w-full px-4 py-3 rounded-2xl bg-cream-50 border border-cream-200 
          text-text-primary placeholder:text-text-muted resize-none
          focus:outline-none focus:ring-2 focus:ring-accent-purple/30 focus:border-accent-purple 
          transition-all duration-200
          ${error ? 'border-accent-red ring-1 ring-accent-red/20' : ''} 
          ${className}`}
        rows={3}
        {...props}
      />
      {error && <p className="text-sm text-accent-red flex items-center gap-1">⚠ {error}</p>}
    </div>
  );
}
