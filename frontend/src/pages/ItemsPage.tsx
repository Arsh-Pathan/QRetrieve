import React, { useState } from 'react';
import { useItems } from '../hooks/useItems';
import { itemService } from '../services/item.service';
import { ItemCard } from '../components/ItemCard';
import { QRCustomizer } from '../components/QRCustomizer';
import { QRSuccessModal } from '../components/QRSuccessModal';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { IconPackage, IconPlus, IconCamera, IconX } from '../components/ui/Symbols';

export function ItemsPage() {
  const { items, loading, refresh } = useItems();
  const [showForm, setShowForm] = useState(false);
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedQR, setSelectedQR] = useState<{ itemId: string; itemName: string; qrDataUrl?: string } | null>(null);

  // BUG FIX: QR Success Modal state — shown immediately after item creation
  const [createdItem, setCreatedItem] = useState<{ itemId: string; itemName: string; qrDataUrl?: string } | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('itemName', itemName);
      if (description) formData.append('description', description);
      if (photo) formData.append('photo', photo);
      const newItem = await itemService.create(formData);

      // BUG FIX: Show QR immediately after creation
      setCreatedItem({
        itemId: newItem.itemId,
        itemName: newItem.itemName,
        qrDataUrl: newItem.qrDataUrl,
      });

      setItemName('');
      setDescription('');
      setPhoto(null);
      setShowForm(false);
      refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Delete this item? This cannot be undone.')) return;
    await itemService.delete(itemId);
    refresh();
  };

  const handleCustomizeFromModal = () => {
    if (createdItem) {
      setSelectedQR(createdItem);
    }
    setCreatedItem(null);
  };

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary">My Items</h1>
          <p className="text-sm text-text-muted">{items.length} item{items.length !== 1 ? 's' : ''} registered</p>
        </div>
        <Button
          size="sm"
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? 'ghost' : 'primary'}
          className="flex items-center gap-1"
        >
          {showForm ? (
            <>
              <IconX size={16} /> Cancel
            </>
          ) : (
            <>
              <IconPlus size={16} /> Add Item
            </>
          )}
        </Button>
      </div>

      {/* Create Form */}
      {showForm && (
        <Card className="animate-slide-down" pastel="sage">
          <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
            <IconPackage size={20} className="text-accent-green" /> Register New Item
          </h3>
          <form onSubmit={handleCreate} className="space-y-3">
            <Input
              label="Item Name"
              placeholder="e.g. MacBook Pro, Keys, Wallet"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
            <Input
              label="Description (optional)"
              placeholder="Color, brand, distinguishing features..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div>
              <label className="text-sm font-medium text-text-secondary">Photo</label>
              <div className="mt-1.5">
                <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white border-2 border-dashed border-cream-300 cursor-pointer hover:border-accent-purple hover:bg-pastel-lavender-light/30 transition-all">
                  <IconCamera size={18} className="text-text-muted" />
                  <span className="text-sm text-text-secondary">
                    {photo ? photo.name : 'Choose a photo'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            <Button type="submit" className="w-full" loading={submitting}>
              Create & Generate QR
            </Button>
          </form>
        </Card>
      )}

      {/* QR Success Modal — BUG FIX: Shows immediately after creation */}
      {createdItem && (
        <QRSuccessModal
          itemId={createdItem.itemId}
          itemName={createdItem.itemName}
          qrDataUrl={createdItem.qrDataUrl}
          onClose={() => setCreatedItem(null)}
          onCustomize={handleCustomizeFromModal}
        />
      )}

      {/* QR Customizer */}
      {selectedQR && (
        <div className="animate-scale-in">
          <button
            onClick={() => setSelectedQR(null)}
            className="text-sm text-text-muted hover:text-text-primary transition-colors mb-2 flex items-center gap-1"
          >
            ← Close QR Designer
          </button>
          <QRCustomizer {...selectedQR} />
        </div>
      )}

      {/* Items List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-3 border-accent-purple border-t-transparent rounded-full animate-spin" />
          <p className="text-text-muted mt-3 text-sm">Loading items...</p>
        </div>
      ) : items.length === 0 ? (
        <Card className="text-center !py-12">
          <div className="flex justify-center mb-4 animate-float">
            <IconPackage size={64} className="text-accent-lavender opacity-30" />
          </div>
          <p className="text-text-secondary font-semibold text-lg">No items yet</p>
          <p className="text-text-muted text-sm mt-1 mb-4">Register your first item to get its QR code</p>
          <Button size="sm" onClick={() => setShowForm(true)}>
            + Add Your First Item
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <ItemCard
              key={item._id}
              item={item}
              onViewQR={() => setSelectedQR({ itemId: item.itemId, itemName: item.itemName, qrDataUrl: item.qrDataUrl })}
              onDelete={() => handleDelete(item.itemId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
