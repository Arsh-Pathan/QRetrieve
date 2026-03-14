import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useItems } from '../hooks/useItems';
import { useReports } from '../hooks/useReports';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { IconMail, IconSmartphone, IconClock, IconLogout } from '../components/ui/Symbols';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const { items } = useItems();
  const { reports } = useReports();

  return (
    <div className="space-y-5 animate-slide-up">
      <h1 className="text-2xl font-extrabold text-text-primary">Profile</h1>

      {/* User card */}
      <Card className="relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-pastel-lavender opacity-20" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-coral 
            flex items-center justify-center text-white text-2xl font-bold uppercase transition-transform hover:scale-105">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <h2 className="font-bold text-text-primary text-lg">{user?.name}</h2>
            <p className="text-sm text-text-muted">{user?.email}</p>
            {user?.phone && (
              <p className="text-xs text-text-muted mt-0.5 flex items-center gap-1">
                <IconSmartphone size={12} /> {user.phone}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card pastel="lavender" className="text-center !p-4">
          <p className="text-2xl font-extrabold text-text-primary">{items.length}</p>
          <p className="text-[10px] text-text-secondary font-medium">Items</p>
        </Card>
        <Card pastel="peach" className="text-center !p-4">
          <p className="text-2xl font-extrabold text-text-primary">{reports.length}</p>
          <p className="text-[10px] text-text-secondary font-medium">Reports</p>
        </Card>
        <Card pastel="sage" className="text-center !p-4">
          <p className="text-2xl font-extrabold text-text-primary">
            {items.length > 0 ? Math.round((items.filter(i => i.status === 'safe').length / items.length) * 100) : 0}%
          </p>
          <p className="text-[10px] text-text-secondary font-medium">Safe Rate</p>
        </Card>
      </div>

      {/* Settings links */}
      <Card>
        <h3 className="font-bold text-text-primary mb-3">Account</h3>
        <div className="space-y-2">
          {[
            { icon: IconMail, label: 'Email', value: user?.email },
            { icon: IconSmartphone, label: 'Phone', value: user?.phone || 'Not set' },
            { icon: IconClock, label: 'Member since', value: 'Active member' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 py-2 border-b border-cream-100 last:border-0">
              <span className="text-text-muted">
                <item.icon size={18} />
              </span>
              <div className="flex-1">
                <p className="text-xs text-text-muted">{item.label}</p>
                <p className="text-sm text-text-primary font-medium">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Button variant="danger" onClick={logout} className="w-full flex items-center justify-center gap-2">
        <IconLogout size={18} />
        Sign Out
      </Button>

      <p className="text-center text-[10px] text-text-muted pb-4">
        QRetrieve v2.0 — Scan it. Find it. Return it.
      </p>
    </div>
  );
}
