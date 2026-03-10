import React, { useState } from 'react';
import { useItems } from '../hooks/useItems';
import { itemService } from '../services/item.service';
import { ItemCard } from '../components/ItemCard';
import { QRCustomizer } from '../components/QRCustomizer';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export function ItemsPage() {
  const { items, loading, refresh } = useItems();
  const [showForm, setShowForm] = useState(false);
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedQR, setSelectedQR] = useState<{ itemId: string; itemName: string; qrDataUrl?: string } | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('itemName', itemName);
      if (description) formData.append('description', description);
      if (photo) formData.append('photo', photo);
      await itemService.create(formData);
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
    if (!confirm('Delete this item?')) return;
    await itemService.delete(itemId);
    refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-primary">My Items</h1>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Item'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleCreate} className="space-y-3">
            <Input label="Item Name" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
            <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <div>
              <label className="text-sm font-medium text-text-secondary">Photo</label>
              <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} className="mt-1 block w-full text-sm" />
            </div>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Item'}
            </Button>
          </form>
        </Card>
      )}

      {selectedQR && (
        <div>
          <button onClick={() => setSelectedQR(null)} className="text-sm text-text-muted hover:underline mb-2">
            Close QR
          </button>
          <QRCustomizer {...selectedQR} />
        </div>
      )}

      {loading ? (
        <p className="text-center text-text-muted py-8">Loading items...</p>
      ) : items.length === 0 ? (
        <Card className="text-center py-8">
          <p className="text-text-muted">No items yet. Add your first item above!</p>
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
