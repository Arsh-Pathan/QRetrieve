import React from 'react';
import { Card } from '../ui/Card';
import { IconMapPin, IconBell, IconClock } from '../ui/Symbols';

interface ActivityTimelineProps {
  reports: any[];
  notifications: any[];
}

export function ActivityTimeline({ reports, notifications }: ActivityTimelineProps) {
  // Merge reports and notifications into timeline events
  const events = [
    ...reports.slice(0, 3).map((r) => ({
      id: r._id,
      type: 'report' as const,
      icon: IconMapPin,
      title: `${r.finderName} found an item`,
      subtitle: r.finderLocation,
      time: r.createdAt,
      pastel: 'peach' as const,
    })),
    ...notifications.filter((n: any) => !n.read).slice(0, 3).map((n: any) => ({
      id: n._id,
      type: 'notification' as const,
      icon: IconBell,
      title: n.title,
      subtitle: n.body,
      time: n.createdAt,
      pastel: 'lavender' as const,
    })),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 5);

  if (events.length === 0) {
    return null;
  }

  const pastelBg = {
    peach: 'bg-pastel-peach-light',
    lavender: 'bg-pastel-lavender-light',
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-text-primary flex items-center gap-2 mb-3">
        <IconClock size={20} /> Activity
      </h2>
      <Card className="!p-4">
        <div className="space-y-0">
          {events.map((event, i) => (
            <div key={event.id} className="flex gap-3 relative">
              {/* Timeline line */}
              {i < events.length - 1 && (
                <div className="absolute left-[17px] top-10 bottom-0 w-0.5 bg-cream-200" />
              )}
              {/* Icon */}
              <div className={`w-9 h-9 rounded-xl ${pastelBg[event.pastel]} flex items-center justify-center flex-shrink-0 z-10 text-text-primary opacity-80`}>
                <event.icon size={16} />
              </div>
              {/* Content */}
              <div className={`flex-1 pb-4 ${i < events.length - 1 ? 'border-b border-cream-100' : ''} mb-1`}>
                <p className="text-sm font-semibold text-text-primary">{event.title}</p>
                <p className="text-xs text-text-muted mt-0.5">{event.subtitle}</p>
                <p className="text-[10px] text-text-muted mt-1">
                  {new Date(event.time).toLocaleDateString(undefined, {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
