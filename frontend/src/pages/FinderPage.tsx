import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { finderService } from '../services/report.service';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

interface ItemInfo {
  itemId: string;
  itemName: string;
  description?: string;
  photoUrl?: string;
  status: string;
}

export function FinderPage() {
  const { itemId } = useParams<{ itemId: string }>();
  const [item, setItem] = useState<ItemInfo | null>(null);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ finderName: '', finderContact: '', finderLocation: '', message: '' });
  const [photo, setPhoto] = useState<File | null>(null);
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!itemId) return;
    finderService.getItemInfo(itemId).then(setItem).catch(() => setError('Item not found'));
  }, [itemId]);

  const getLocation = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setForm((f) => ({ ...f, finderLocation: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}` }));
        setLocating(false);
      },
      () => setLocating(false),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemId) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('finderName', form.finderName);
      formData.append('finderContact', form.finderContact);
      formData.append('finderLocation', form.finderLocation);
      if (form.message) formData.append('message', form.message);
      if (coords) {
        formData.append('latitude', coords.lat.toString());
        formData.append('longitude', coords.lng.toString());
      }
      if (photo) formData.append('photo', photo);
      await finderService.submitReport(itemId, formData);
      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  if (error) {
    return (
      <div className="min-h-screen bg-beige-50 flex items-center justify-center p-4">
        <Card className="text-center max-w-md">
          <p className="text-red-500 font-medium">{error}</p>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-beige-50 flex items-center justify-center p-4">
        <Card className="text-center max-w-md space-y-3">
          <h2 className="text-xl font-bold text-text-primary">Thank you!</h2>
          <p className="text-text-secondary">The owner has been notified. They'll reach out to arrange pickup.</p>
        </Card>
      </div>
    );
  }

  if (!item) {
    return <div className="min-h-screen bg-beige-50 flex items-center justify-center text-text-muted">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-beige-50 p-4">
      <div className="max-w-md mx-auto space-y-4">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-text-primary">Found an Item?</h1>
          <p className="text-text-secondary">Help return it to its owner</p>
        </div>

        <Card>
          {item.photoUrl && (
            <img src={item.photoUrl} alt={item.itemName} className="w-full h-48 rounded-2xl object-cover mb-4" />
          )}
          <h2 className="text-lg font-semibold text-text-primary">{item.itemName}</h2>
          {item.description && <p className="text-sm text-text-secondary mt-1">{item.description}</p>}
        </Card>

        <Card>
          <h3 className="font-semibold text-text-primary mb-4">Report Found</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input label="Your Name" value={form.finderName} onChange={update('finderName')} required />
            <Input label="Contact (email or phone)" value={form.finderContact} onChange={update('finderContact')} />
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Input label="Location" value={form.finderLocation} onChange={update('finderLocation')} required />
              </div>
              <Button type="button" size="sm" variant="secondary" onClick={getLocation} disabled={locating}>
                {locating ? '...' : 'GPS'}
              </Button>
            </div>
            <Input label="Message (optional)" value={form.message} onChange={update('message')} />
            <div>
              <label className="text-sm font-medium text-text-secondary">Photo of item</label>
              <input type="file" accept="image/*" capture="environment" onChange={(e) => setPhoto(e.target.files?.[0] || null)} className="mt-1 block w-full text-sm" />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
