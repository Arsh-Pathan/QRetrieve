import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useItems } from '../hooks/useItems';
import { useReports } from '../hooks/useReports';
import { useNotifications } from '../hooks/useNotifications';
import { StatsGrid } from '../components/Dashboard/StatsGrid';
import { QuickActions } from '../components/Dashboard/QuickActions';
import { RecentItems } from '../components/Dashboard/RecentItems';
import { ProgressCard } from '../components/Dashboard/ProgressCard';
import { ActivityTimeline } from '../components/Dashboard/ActivityTimeline';
import { QRCustomizer } from '../components/QRCustomizer';
import { IconShield, IconMapPin, IconBell, IconCheck, IconChevronRight } from '../components/ui/Symbols';

export function DashboardPage() {
  const { user } = useAuth();
  const { items } = useItems();
  const { reports } = useReports();
  const { notifications, unreadCount, markAllRead } = useNotifications();
  const [selectedQR, setSelectedQR] = React.useState<{ itemId: string; itemName: string; qrDataUrl?: string } | null>(null);

  // Get current hour for dynamic greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Greeting */}
      <div className="relative">
        <div className="absolute -right-4 -top-2 w-20 h-20 rounded-full bg-pastel-lavender opacity-20 animate-float" />
        <div className="absolute right-8 top-6 w-12 h-12 rounded-full bg-pastel-sage opacity-15 animate-float" style={{ animationDelay: '1s' }} />
        <h1 className="text-2xl font-extrabold text-text-primary">
          {greeting}, {user?.name?.split(' ')[0]} 
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Manage your items & recover lost belongings faster.
        </p>
      </div>

      {/* Status Row (mood-tracker style) */}
      {items.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {[
            { icon: IconShield, label: 'All Safe', active: items.every(i => i.status === 'safe') },
            { icon: IconMapPin, label: 'Found', active: items.some(i => i.status === 'found') },
            { icon: IconBell, label: 'Alerts', active: unreadCount > 0 },
            { icon: IconCheck, label: 'Good', active: !items.some(i => i.status === 'found') },
          ].map((status) => (
            <div
              key={status.label}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all flex-shrink-0
                ${status.active
                  ? 'bg-pastel-sage-light ring-2 ring-accent-green/30'
                   : 'bg-cream-100'
                }`}
            >
              <status.icon size={20} className={status.active ? 'text-accent-green' : 'text-text-muted'} />
              <span className="text-[10px] font-medium text-text-secondary">{status.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Stats Grid */}
      <StatsGrid items={items} reports={reports} />

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Items */}
      <RecentItems
        items={items}
        onViewQR={(item) => setSelectedQR({ itemId: item.itemId, itemName: item.itemName, qrDataUrl: item.qrDataUrl })}
      />

      {/* QR Customizer overlay */}
      {selectedQR && (
        <div className="animate-scale-in">
          <button
            onClick={() => setSelectedQR(null)}
            className="text-sm text-text-muted hover:text-text-primary transition-colors mb-2 flex items-center gap-1"
          >
            ← Close QR Preview
          </button>
          <QRCustomizer {...selectedQR} />
        </div>
      )}

      {/* Progress Card */}
      {items.length > 0 && <ProgressCard items={items} />}

      {/* Activity Timeline */}
      <ActivityTimeline reports={reports} notifications={notifications} />

      {/* Notification Banner */}
      {unreadCount > 0 && (
        <div className="bg-pastel-peach-light rounded-3xl p-4 flex items-center gap-3 animate-slide-up">
          <div className="w-10 h-10 bg-white/60 rounded-xl flex items-center justify-center flex-shrink-0 text-accent-coral">
            <IconBell size={20} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-text-primary">
              {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
            </p>
            <p className="text-xs text-text-secondary">Tap to view</p>
          </div>
          <button
            onClick={markAllRead}
            className="text-xs font-semibold text-accent-coral hover:underline"
          >
            Mark read
          </button>
        </div>
      )}
    </div>
  );
}
