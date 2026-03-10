import React from 'react';
import { NavLink } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';

const tabs = [
  { path: '/dashboard', label: 'Home', icon: '⌂' },
  { path: '/items', label: 'Items', icon: '◫' },
  { path: '/qr', label: 'QR', icon: '⊞' },
  { path: '/reports', label: 'Reports', icon: '⊟' },
  { path: '/profile', label: 'Profile', icon: '○' },
];

export function BottomNav() {
  const { unreadCount } = useNotifications();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-beige-200 px-2 py-1 z-50">
      <div className="max-w-lg mx-auto flex justify-around">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-3 text-xs transition-colors ${
                isActive ? 'text-accent-coral' : 'text-text-muted hover:text-text-secondary'
              }`
            }
          >
            <span className="text-lg relative">
              {tab.icon}
              {tab.label === 'Home' && unreadCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-accent-coral text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </span>
            <span>{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
