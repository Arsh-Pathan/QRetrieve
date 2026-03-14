import React from 'react';
import { Card } from '../ui/Card';

interface ProgressCardProps {
  items: any[];
}

export function ProgressCard({ items }: ProgressCardProps) {
  const total = items.length;
  const found = items.filter((i) => i.status === 'found').length;
  const safe = items.filter((i) => i.status === 'safe').length;
  const safePercent = total > 0 ? Math.round((safe / total) * 100) : 0;

  return (
    <Card className="relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-pastel-lavender opacity-20" />
      <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-pastel-sage opacity-15" />

      <div className="relative z-10">
        <h2 className="text-lg font-bold text-text-primary flex items-center gap-2 mb-4">
          <span>📊</span> Recovery Overview
        </h2>
        <div className="flex items-center gap-6">
          {/* Progress circle */}
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#ede7fb" strokeWidth="10" />
              <circle
                cx="50" cy="50" r="40" fill="none"
                stroke="#9c7ce6" strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${safePercent * 2.51} 251`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-extrabold text-text-primary">{safePercent}%</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-text-secondary">Items protected</p>
            <p className="text-xs text-text-muted mt-2">
              <span className="font-semibold text-accent-green">{safe} safe</span> · {' '}
              <span className="font-semibold text-accent-blue">{found} found</span> · {' '}
              <span className="font-semibold text-text-primary">{total} total</span>
            </p>
            {/* Mini bar */}
            <div className="mt-3 h-2 bg-cream-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent-green to-accent-purple rounded-full progress-bar"
                style={{ width: `${safePercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
