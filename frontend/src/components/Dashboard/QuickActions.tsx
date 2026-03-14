import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { IconPlus, IconQrCode, IconClipboard, IconUser, IconZap, IconArrowRight } from '../ui/Symbols';

const actions = [
  { label: 'Register Item', icon: IconPlus, path: '/items', pastel: 'sage' as const, desc: 'Add new item' },
  { label: 'QR Generator', icon: IconQrCode, path: '/qr', pastel: 'lavender' as const, desc: 'Create & customize' },
  { label: 'View Reports', icon: IconClipboard, path: '/reports', pastel: 'peach' as const, desc: 'Found reports' },
  { label: 'My Profile', icon: IconUser, path: '/profile', pastel: 'blue' as const, desc: 'Account settings' },
];

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
        <IconZap size={20} className="text-accent-yellow fill-accent-yellow" /> Quick Actions
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
            <div className="mb-2">
              <action.icon size={26} className="text-text-primary opacity-80" />
            </div>
            <p className="font-semibold text-text-primary text-sm">{action.label}</p>
            <p className="text-xs text-text-secondary mt-0.5">{action.desc}</p>
            <div className="flex justify-end mt-2">
              <span className="w-7 h-7 bg-white/60 rounded-full flex items-center justify-center text-text-primary">
                <IconArrowRight size={14} />
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
