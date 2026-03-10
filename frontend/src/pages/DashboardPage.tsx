import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useItems } from '../hooks/useItems';
import { useNotifications } from '../hooks/useNotifications';
import { Card } from '../components/ui/Card';

export function DashboardPage() {
  const { user } = useAuth();
  const { items } = useItems();
  const { notifications, unreadCount, markAllRead } = useNotifications();

  const safeCount = items.filter((i) => i.status === 'safe').length;
  const foundCount = items.filter((i) => i.status === 'found').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Hello, {user?.name}</h1>
        <p className="text-text-secondary">Welcome back to QRetrieve</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center !p-4">
          <p className="text-2xl font-bold text-accent-green">{safeCount}</p>
          <p className="text-xs text-text-muted">Safe</p>
        </Card>
        <Card className="text-center !p-4">
          <p className="text-2xl font-bold text-accent-coral">{foundCount}</p>
          <p className="text-xs text-text-muted">Found</p>
        </Card>
        <Card className="text-center !p-4">
          <p className="text-2xl font-bold text-accent-blue">{items.length}</p>
          <p className="text-xs text-text-muted">Total</p>
        </Card>
      </div>

      {unreadCount > 0 && (
        <Card>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-text-primary">Notifications ({unreadCount})</h2>
            <button onClick={markAllRead} className="text-xs text-accent-coral hover:underline">
              Mark all read
            </button>
          </div>
          <div className="space-y-2">
            {notifications.filter((n) => !n.read).slice(0, 5).map((n) => (
              <div key={n._id} className="p-3 bg-beige-50 rounded-2xl">
                <p className="text-sm font-medium text-text-primary">{n.title}</p>
                <p className="text-xs text-text-secondary">{n.body}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
