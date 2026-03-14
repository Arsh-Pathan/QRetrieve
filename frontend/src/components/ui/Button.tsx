import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'pastel';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
}

const variants = {
  primary: 'bg-accent-coral text-white hover:shadow-glow-coral hover:brightness-105',
  secondary: 'bg-cream-200 text-text-primary hover:bg-cream-300',
  danger: 'bg-accent-red text-white hover:brightness-105',
  ghost: 'bg-transparent text-text-secondary hover:bg-cream-100',
  pastel: 'bg-pastel-lavender-light text-accent-purple hover:bg-pastel-lavender',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-base gap-2',
  lg: 'px-7 py-3.5 text-lg gap-2',
};

export function Button({ variant = 'primary', size = 'md', icon, loading, className = '', children, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-2xl font-semibold transition-all duration-200 
        disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]
        ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
