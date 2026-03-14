import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  pastel?: 'lavender' | 'sage' | 'yellow' | 'peach' | 'blue';
  hoverable?: boolean;
  onClick?: () => void;
}

const pastelBg = {
  lavender: 'bg-pastel-lavender-light',
  sage: 'bg-pastel-sage-light',
  yellow: 'bg-pastel-yellow-light',
  peach: 'bg-pastel-peach-light',
  blue: 'bg-pastel-blue-light',
};

export function Card({ children, className = '', pastel, hoverable = false, onClick }: CardProps) {
  const bg = pastel ? pastelBg[pastel] : 'bg-white';
  const hover = hoverable ? 'card-hover cursor-pointer' : '';
  const Tag = onClick ? 'button' : 'div';

  return (
    <Tag
      className={`${bg} rounded-3xl shadow-card p-6 animate-fade-in ${hover} ${className}`}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
    >
      {children}
    </Tag>
  );
}
