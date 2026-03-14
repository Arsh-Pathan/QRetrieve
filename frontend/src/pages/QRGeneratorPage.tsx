import React, { useState } from 'react';
import { useItems } from '../hooks/useItems';
import { itemService } from '../services/item.service';
import { QRCustomizer } from '../components/QRCustomizer';
import { Card } from '../components/ui/Card';
import { EmptyStateIllustration } from '../components/illustrations/SVGIllustrations';

export function QRGeneratorPage() {
  const { items, loading } = useItems();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [qrData, setQrData] = useState<{ dataUrl: string; svg: string } | null>(null);

  const handleSelect = async (itemId: string) => {
    setSelectedItem(itemId);
    try {
      const data = await itemService.getQrCode(itemId);
      setQrData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const item = items.find((i) => i.itemId === selectedItem);

  return (
    <div className="space-y-5 animate-slide-up">
      <div>
        <h1 className="text-2xl font-extrabold text-text-primary">QR Designer</h1>
        <p className="text-text-secondary text-sm mt-0.5">Select an item to generate & customize its QR code</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-3 border-accent-purple border-t-transparent rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <Card className="text-center !py-10">
          <div className="flex justify-center mb-3">
            <EmptyStateIllustration size={120} />
          </div>
          <p className="text-text-secondary font-medium">No items to generate QR for</p>
          <p className="text-text-muted text-xs mt-1">Register an item first</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {items.map((i) => (
            <button
              key={i.itemId}
              onClick={() => handleSelect(i.itemId)}
              className={`w-full text-left p-4 rounded-2xl transition-all duration-200 flex items-center gap-3
                ${
                  selectedItem === i.itemId
                    ? 'bg-pastel-lavender-light ring-2 ring-accent-purple shadow-glow-purple'
                    : 'bg-white shadow-soft hover:shadow-card'
                }`}
            >
              {i.photoUrl ? (
                <img src={i.photoUrl} alt={i.itemName} className="w-10 h-10 rounded-xl object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-pastel-lavender-light flex items-center justify-center">
                  <span>📦</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-text-primary text-sm truncate">{i.itemName}</p>
                {i.description && <p className="text-xs text-text-muted truncate">{i.description}</p>}
              </div>
              {selectedItem === i.itemId && (
                <span className="text-accent-purple text-lg">✓</span>
              )}
            </button>
          ))}
        </div>
      )}

      {item && qrData && (
        <div className="animate-scale-in">
          <QRCustomizer itemId={item.itemId} itemName={item.itemName} qrDataUrl={qrData.dataUrl} />
        </div>
      )}
    </div>
  );
}
