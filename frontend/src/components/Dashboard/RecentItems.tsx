import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';

interface RecentItemsProps {
  items: any[];
  onViewQR: (item: any) => void;
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  safe: { bg: 'bg-pastel-sage-light', text: 'text-green-700', dot: 'bg-accent-green' },
  found: { bg: 'bg-pastel-blue-light', text: 'text-blue-700', dot: 'bg-accent-blue' },
  lost: { bg: 'bg-pastel-peach-light', text: 'text-red-700', dot: 'bg-accent-red' },
};

export function RecentItems({ items, onViewQR }: RecentItemsProps) {
  const navigate = useNavigate();
  const recent = items.slice(0, 4);

  if (recent.length === 0) {
    return (
      <Card className="text-center !py-10">
        <div className="text-4xl mb-3 animate-float">📦</div>
        <p className="text-text-secondary font-medium">No items registered yet</p>
        <p className="text-text-muted text-sm mt-1">Add your first item to get started</p>
        <button
          onClick={() => navigate('/items')}
          className="mt-4 px-5 py-2 bg-accent-coral text-white rounded-2xl font-semibold text-sm
            hover:shadow-glow-coral transition-all duration-200"
        >
          + Register Item
        </button>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
          <span>📦</span> Your Items
        </h2>
        <button
          onClick={() => navigate('/items')}
          className="text-sm text-accent-purple font-semibold hover:underline"
        >
          View all →
        </button>
      </div>
      <div className="space-y-2.5">
        {recent.map((item) => {
          const status = statusConfig[item.status] || statusConfig.safe;
          return (
            <Card key={item._id} hoverable className="!p-4 flex items-center gap-3">
              {item.photoUrl ? (
                <img
                  src={item.photoUrl}
                  alt={item.itemName}
                  className="w-12 h-12 rounded-2xl object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-pastel-lavender-light flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">📱</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-text-primary truncate">{item.itemName}</p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${status.bg} ${status.text}`}>
                    {item.status}
                  </span>
                </div>
                {item.description && (
                  <p className="text-xs text-text-muted truncate mt-0.5">{item.description}</p>
                )}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onViewQR(item); }}
                className="flex-shrink-0 w-9 h-9 rounded-xl bg-pastel-lavender-light 
                  flex items-center justify-center hover:bg-pastel-lavender transition-colors"
                title="View QR Code"
              >
                <span className="text-sm">⊞</span>
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
