import React from 'react';
import { Card } from '../ui/Card';
import { IconPackage, IconShield, IconMapPin, IconClipboard } from '../ui/Symbols';

interface Stat {
  label: string;
  value: number;
  icon: React.ElementType;
  pastel: 'sage' | 'peach' | 'blue' | 'lavender' | 'yellow';
}

interface StatsGridProps {
  items: any[];
  reports: any[];
}

export function StatsGrid({ items, reports }: StatsGridProps) {
  const safeCount = items.filter((i) => i.status === 'safe').length;
  const foundCount = items.filter((i) => i.status === 'found').length;

  const stats: Stat[] = [
    { label: 'Total Items', value: items.length, icon: IconPackage, pastel: 'lavender' },
    { label: 'Safe', value: safeCount, icon: IconShield, pastel: 'sage' },
    { label: 'Found', value: foundCount, icon: IconMapPin, pastel: 'peach' },
    { label: 'Reports', value: reports.length, icon: IconClipboard, pastel: 'blue' },
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
          <div className="flex justify-center mb-1">
            <stat.icon size={24} className="text-text-primary opacity-80" />
          </div>
          <p className="text-3xl font-extrabold text-text-primary">{stat.value}</p>
          <p className="text-xs font-medium text-text-secondary mt-0.5">{stat.label}</p>
        </Card>
      ))}
    </div>
  );
}
