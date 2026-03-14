import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { finderService } from '../services/report.service';
import { Card } from '../components/ui/Card';
import { Input, TextArea } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { FoundItemIllustration, ShieldIllustration, SuccessIllustration } from '../components/illustrations/SVGIllustrations';
import { 
  IconAlertCircle, 
  IconCheckCircle, 
  IconLock, 
  IconZap, 
  IconPackage, 
  IconClipboard, 
  IconUser, 
  IconMail, 
  IconMapPin, 
  IconCamera,
  IconCheck,
  IconSmile
} from '../components/ui/Symbols';

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

  // Auto-detect location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      getLocation();
    }
  }, []);

  const getLocation = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setForm((f) => ({
          ...f,
          finderLocation: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
        }));
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
      setError('Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
        <Card className="text-center max-w-md animate-scale-in">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-pastel-peach-light rounded-3xl text-accent-red">
              <IconAlertCircle size={48} />
            </div>
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">Oops!</h2>
          <p className="text-text-secondary">{error}</p>
          <Button 
            className="mt-6 w-full" 
            variant="pastel" 
            onClick={() => setError('')}
          >
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  // Success state
  if (submitted) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
        <Card className="text-center max-w-md space-y-4 animate-scale-in">
          <div className="flex justify-center animate-bounce-soft">
            <SuccessIllustration size={120} />
          </div>
          <h2 className="text-2xl font-extrabold text-text-primary flex items-center justify-center gap-2">
            Thank You! <IconSmile className="text-accent-yellow" size={28} />
          </h2>
          <p className="text-text-secondary">
            The owner has been notified instantly. They'll reach out to arrange pickup.
          </p>
          <div className="bg-pastel-sage-light rounded-2xl p-4 text-sm text-green-700">
            <div className="flex items-center justify-center gap-2 mb-1">
              <IconCheckCircle size={18} />
              <p className="font-semibold">Your good deed matters!</p>
            </div>
            <p className="text-xs opacity-80">The owner will be incredibly grateful.</p>
          </div>
        </Card>
      </div>
    );
  }

  // Loading state
  if (!item) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-3 border-accent-purple border-t-transparent rounded-full animate-spin" />
          <p className="text-text-muted mt-3">Loading item info...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header gradient */}
      <div className="bg-gradient-to-b from-pastel-lavender-light/50 to-cream-50 pt-8 pb-4 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="flex justify-center mb-4 animate-float">
            <FoundItemIllustration size={120} />
          </div>
          <h1 className="text-2xl font-extrabold text-text-primary mb-1">
            Someone Lost This Item
          </h1>
          <p className="text-text-secondary text-sm">
            Thanks for scanning! Help return it by filling out a quick form below.
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pb-8 space-y-4 animate-slide-up">
        {/* Trust badges */}
        <div className="flex gap-3 justify-center">
          {[
            { icon: <ShieldIllustration size={28} />, label: 'Secure', bg: 'bg-white' },
            { icon: <IconLock size={16} className="text-accent-blue" />, label: 'Private', bg: 'bg-pastel-blue-light' },
            { icon: <IconZap size={16} className="text-accent-yellow" />, label: 'Instant', bg: 'bg-pastel-yellow-light' },
          ].map((badge) => (
            <div key={badge.label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${badge.bg} shadow-soft text-xs`}>
              {badge.icon}
              <span className="font-medium text-text-secondary">{badge.label}</span>
            </div>
          ))}
        </div>

        {/* Item info card */}
        <Card>
          <div className="flex gap-4 items-center">
            {item.photoUrl ? (
              <img src={item.photoUrl} alt={item.itemName} className="w-20 h-20 rounded-2xl object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-pastel-lavender-light flex items-center justify-center text-accent-purple">
                <IconPackage size={32} />
              </div>
            )}
            <div>
              <p className="text-[10px] tracking-wider text-accent-purple font-bold mb-0.5 uppercase">Found Item</p>
              <h2 className="text-lg font-bold text-text-primary">{item.itemName}</h2>
              {item.description && <p className="text-sm text-text-secondary mt-0.5 line-clamp-2">{item.description}</p>}
            </div>
          </div>
        </Card>

        {/* Report form */}
        <Card>
          <h3 className="font-bold text-text-primary mb-1 flex items-center gap-2">
            <IconClipboard size={18} className="text-accent-coral" /> Quick Report
          </h3>
          <p className="text-xs text-text-muted mb-4 font-medium">Takes less than 30 seconds</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Your Name"
              value={form.finderName}
              onChange={update('finderName')}
              required
              placeholder="What should the owner call you?"
              icon={<IconUser size={16} className="text-text-muted" />}
            />
            <Input
              label="Contact (optional)"
              value={form.finderContact}
              onChange={update('finderContact')}
              placeholder="Email or phone"
              icon={<IconMail size={16} className="text-text-muted" />}
            />
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Input
                  label="Location"
                  value={form.finderLocation}
                  onChange={update('finderLocation')}
                  required
                  placeholder="Where did you find it?"
                  icon={<IconMapPin size={16} className="text-text-muted" />}
                />
              </div>
              <Button
                type="button"
                size="sm"
                variant="pastel"
                onClick={getLocation}
                disabled={locating}
                loading={locating}
                className="mb-0.5 h-[42px] px-4"
              >
                GPS
              </Button>
            </div>

            <TextArea
              label="Message (optional)"
              value={form.message}
              onChange={update('message')}
              placeholder="Any details about the item's condition..."
              rows={2}
            />

            <div>
              <label className="text-sm font-medium text-text-secondary pl-1">Photo of item</label>
              <label className="mt-2 flex items-center justify-center gap-3 px-4 py-4 rounded-2xl bg-cream-50 border-2 border-dashed border-cream-300 cursor-pointer hover:border-accent-purple hover:bg-white transition-all group">
                <IconCamera size={24} className="text-text-muted group-hover:text-accent-purple" />
                <span className="text-sm text-text-secondary font-medium group-hover:text-text-primary">
                  {photo ? photo.name : 'Take or choose a photo'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>

            <Button type="submit" className="w-full !py-4 text-base shadow-glow-purple" loading={submitting}>
              <IconCheck className="mr-2" size={20} /> Report Item Found
            </Button>

            <p className="text-[10px] text-text-muted text-center font-medium">
              Your information is only shared with the item's owner.
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
