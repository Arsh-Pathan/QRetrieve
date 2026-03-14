import React from 'react';
import { NavLink } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import { IconHome, IconPackage, IconQrCode, IconClipboard, IconUser } from './ui/Symbols';

const tabs = [
  { path: '/dashboard', label: 'Home', icon: IconHome },
  { path: '/items', label: 'Items', icon: IconPackage },
  { path: '/qr', label: 'QR', icon: IconQrCode },
  { path: '/reports', label: 'Reports', icon: IconClipboard },
  { path: '/profile', label: 'Profile', icon: IconUser },
];

export function BottomNav() {
  const { unreadCount } = useNotifications();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass bottom-safe">
      <div className="max-w-lg mx-auto flex justify-around px-2 py-1.5">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `flex flex-col items-center py-1.5 px-3 rounded-2xl text-xs transition-all duration-200 ${
                isActive
                  ? 'text-accent-purple bg-pastel-lavender-light font-semibold'
                  : 'text-text-muted hover:text-text-secondary'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="text-lg relative">
                  <tab.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  {tab.label === 'Home' && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-2.5 bg-accent-coral text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse-soft">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </span>
                <span className="mt-0.5">{tab.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
