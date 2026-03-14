import React from 'react';
import { Item } from '../services/item.service';
import { Card } from './ui/Card';

const statusConfig: Record<string, { bg: string; text: string }> = {
  safe: { bg: 'bg-pastel-sage-light', text: 'text-green-700' },
  lost: { bg: 'bg-pastel-peach-light', text: 'text-red-700' },
  found: { bg: 'bg-pastel-blue-light', text: 'text-blue-700' },
};

interface ItemCardProps {
  item: Item;
  onViewQR?: () => void;
  onDelete?: () => void;
}

export function ItemCard({ item, onViewQR, onDelete }: ItemCardProps) {
  const status = statusConfig[item.status] || statusConfig.safe;

  return (
    <Card hoverable className="flex gap-4 !p-4">
      {/* Photo or placeholder */}
      {item.photoUrl ? (
        <img src={item.photoUrl} alt={item.itemName} className="w-16 h-16 rounded-2xl object-cover flex-shrink-0" />
      ) : (
        <div className="w-16 h-16 rounded-2xl bg-pastel-lavender-light flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">📱</span>
        </div>
      )}
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-text-primary truncate text-sm">{item.itemName}</h3>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${status.bg} ${status.text} flex-shrink-0`}>
            {item.status.toUpperCase()}
          </span>
        </div>
        {item.description && (
          <p className="text-xs text-text-muted truncate">{item.description}</p>
        )}
        <div className="flex gap-3 mt-2.5">
          {onViewQR && (
            <button
              onClick={onViewQR}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-pastel-lavender-light text-accent-purple 
                text-xs font-semibold hover:bg-pastel-lavender transition-all"
            >
              ⊞ QR Code
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="text-xs text-text-muted font-medium hover:text-accent-red transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
