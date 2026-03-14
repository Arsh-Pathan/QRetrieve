import React, { useState } from 'react';
import { useItems } from '../hooks/useItems';
import { itemService } from '../services/item.service';
import { QRCustomizer } from '../components/QRCustomizer';
import { Card } from '../components/ui/Card';
import { EmptyStateIllustration } from '../components/illustrations/SVGIllustrations';
import { IconPackage, IconCheck, IconQrCode } from '../components/ui/Symbols';

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
    <div className="space-y-6 animate-slide-up">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary">QR Designer</h1>
          <p className="text-text-secondary text-sm mt-0.5">Select an item to generate & customize its QR code</p>
        </div>
        <div className="p-2 bg-white rounded-2xl shadow-soft">
           <IconQrCode size={20} className="text-accent-purple" />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-3 border-accent-purple border-t-transparent rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <Card className="text-center !py-16 !bg-transparent border-2 border-dashed border-cream-200">
          <div className="flex justify-center mb-6">
            <EmptyStateIllustration size={140} className="opacity-60" />
          </div>
          <p className="text-text-primary font-bold text-lg">No items registered yet</p>
          <p className="text-text-muted text-xs mt-2">Add an item first to generate its unique QR code</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((i) => (
            <button
              key={i.itemId}
              onClick={() => handleSelect(i.itemId)}
              className={`w-full text-left p-4 rounded-2xl transition-all duration-300 flex items-center gap-4 border-2
                ${
                  selectedItem === i.itemId
                    ? 'bg-pastel-lavender-light border-accent-purple shadow-glow-purple scale-[1.02]'
                    : 'bg-white border-transparent shadow-soft hover:shadow-card hover:border-cream-200'
                }`}
            >
              <div className="relative">
                {i.photoUrl ? (
                  <img src={i.photoUrl} alt={i.itemName} className="w-12 h-12 rounded-xl object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pastel-lavender to-pastel-lavender-light flex items-center justify-center text-accent-purple">
                    <IconPackage size={24} />
                  </div>
                )}
                {selectedItem === i.itemId && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-accent-purple rounded-full flex items-center justify-center border-2 border-white shadow-soft">
                    <IconCheck size={12} className="text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-bold text-sm truncate ${selectedItem === i.itemId ? 'text-accent-purple' : 'text-text-primary'}`}>
                  {i.itemName}
                </p>
                {i.description && <p className="text-[11px] text-text-muted truncate mt-0.5">{i.description}</p>}
              </div>
              <div className={`transition-all duration-300 ${selectedItem === i.itemId ? 'rotate-90 opacity-100' : 'opacity-30'}`}>
                <IconQrCode size={18} />
              </div>
            </button>
          ))}
        </div>
      )}

      {item && qrData && (
        <div className="animate-scale-in mt-2">
          <div className="flex items-center gap-2 mb-4 px-2">
            <div className="w-1.5 h-6 bg-accent-purple rounded-full" />
            <h2 className="font-bold text-text-primary">Customize QR for {item.itemName}</h2>
          </div>
          <QRCustomizer itemId={item.itemId} itemName={item.itemName} qrDataUrl={qrData.dataUrl} />
        </div>
      )}
    </div>
  );
}
