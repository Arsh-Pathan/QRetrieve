import React, { useState } from 'react';
import { useItems } from '../hooks/useItems';
import { itemService } from '../services/item.service';
import { QRCustomizer } from '../components/QRCustomizer';

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
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-text-primary">QR Generator</h1>
      <p className="text-text-secondary text-sm">Select an item to generate its QR code</p>

      {loading ? (
        <p className="text-text-muted text-center py-8">Loading...</p>
      ) : (
        <div className="space-y-2">
          {items.map((i) => (
            <button
              key={i.itemId}
              onClick={() => handleSelect(i.itemId)}
              className={`w-full text-left p-4 rounded-2xl transition-all ${
                selectedItem === i.itemId
                  ? 'bg-accent-coral bg-opacity-10 border-2 border-accent-coral'
                  : 'bg-white border-2 border-transparent shadow-soft hover:shadow-card'
              }`}
            >
              <p className="font-medium text-text-primary">{i.itemName}</p>
              {i.description && <p className="text-sm text-text-secondary">{i.description}</p>}
            </button>
          ))}
        </div>
      )}

      {item && qrData && (
        <QRCustomizer itemId={item.itemId} itemName={item.itemName} qrDataUrl={qrData.dataUrl} />
      )}
    </div>
  );
}
