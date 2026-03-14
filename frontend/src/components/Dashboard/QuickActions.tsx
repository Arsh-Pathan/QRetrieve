import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';

const actions = [
  { label: 'Register Item', icon: '➕', path: '/items', pastel: 'sage' as const, desc: 'Add new item' },
  { label: 'QR Generator', icon: '⊞', path: '/qr', pastel: 'lavender' as const, desc: 'Create & customize' },
  { label: 'View Reports', icon: '📋', path: '/reports', pastel: 'peach' as const, desc: 'Found reports' },
  { label: 'My Profile', icon: '👤', path: '/profile', pastel: 'blue' as const, desc: 'Account settings' },
];

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
        <span>⚡</span> Quick Actions
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Card
            key={action.label}
            pastel={action.pastel}
            hoverable
            onClick={() => navigate(action.path)}
            className="!p-4 text-left w-full"
          >
            <div className="text-2xl mb-2">{action.icon}</div>
            <p className="font-semibold text-text-primary text-sm">{action.label}</p>
            <p className="text-xs text-text-secondary mt-0.5">{action.desc}</p>
            <div className="flex justify-end mt-2">
              <span className="w-7 h-7 bg-white/60 rounded-full flex items-center justify-center text-text-primary text-sm">
                →
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
