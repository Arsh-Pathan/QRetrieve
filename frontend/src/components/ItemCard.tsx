import React from 'react';
import { Item } from '../services/item.service';
import { Card } from './ui/Card';

const statusColors = {
  safe: 'bg-accent-green text-green-800',
  lost: 'bg-accent-yellow text-yellow-800',
  found: 'bg-accent-blue text-blue-800',
};

interface ItemCardProps {
  item: Item;
  onViewQR?: () => void;
  onDelete?: () => void;
}

export function ItemCard({ item, onViewQR, onDelete }: ItemCardProps) {
  return (
    <Card className="flex gap-4">
      {item.photoUrl && (
        <img src={item.photoUrl} alt={item.itemName} className="w-20 h-20 rounded-2xl object-cover" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-text-primary truncate">{item.itemName}</h3>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[item.status]}`}>
            {item.status}
          </span>
        </div>
        {item.description && (
          <p className="text-sm text-text-secondary truncate">{item.description}</p>
        )}
        <div className="flex gap-2 mt-3">
          {onViewQR && (
            <button onClick={onViewQR} className="text-xs text-accent-coral font-medium hover:underline">
              View QR
            </button>
          )}
          {onDelete && (
            <button onClick={onDelete} className="text-xs text-red-400 font-medium hover:underline">
              Delete
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
