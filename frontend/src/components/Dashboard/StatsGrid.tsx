import React from 'react';
import { Card } from '../ui/Card';

interface Stat {
  label: string;
  value: number;
  icon: string;
  pastel: 'sage' | 'peach' | 'blue' | 'lavender' | 'yellow';
}

interface StatsGridProps {
  items: any[];
  reports: any[];
}

export function StatsGrid({ items, reports }: StatsGridProps) {
  const safeCount = items.filter((i) => i.status === 'safe').length;
  const foundCount = items.filter((i) => i.status === 'found').length;
  const recoveryRate = items.length > 0 ? Math.round((foundCount / items.length) * 100) : 0;

  const stats: Stat[] = [
    { label: 'Total Items', value: items.length, icon: '📦', pastel: 'lavender' },
    { label: 'Safe', value: safeCount, icon: '🛡️', pastel: 'sage' },
    { label: 'Found', value: foundCount, icon: '📍', pastel: 'peach' },
    { label: 'Reports', value: reports.length, icon: '📋', pastel: 'blue' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, i) => (
        <Card
          key={stat.label}
          pastel={stat.pastel}
          className="!p-4 text-center"
          hoverable
        >
          <div className="text-2xl mb-1">{stat.icon}</div>
          <p className="text-3xl font-extrabold text-text-primary">{stat.value}</p>
          <p className="text-xs font-medium text-text-secondary mt-0.5">{stat.label}</p>
        </Card>
      ))}
    </div>
  );
}
