import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { IconUser, IconMail, IconLock, IconSmartphone } from '../components/ui/Symbols';

export function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <Card className="animate-slide-up !p-8 shadow-glow-purple/10">
      <div className="mb-8 overflow-hidden">
        <h2 className="text-2xl font-black text-text-primary mb-1">Create Account</h2>
        <p className="text-sm text-text-muted">Start protecting your belongings today</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          value={form.name}
          onChange={update('name')}
          required
          placeholder="John Doe"
          icon={<IconUser size={16} className="text-text-muted" />}
        />
        <Input
          label="Email Address"
          type="email"
          value={form.email}
          onChange={update('email')}
          required
          placeholder="you@example.com"
          icon={<IconMail size={16} className="text-text-muted" />}
        />
        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={update('password')}
          required
          minLength={6}
          placeholder="At least 6 characters"
          icon={<IconLock size={16} className="text-text-muted" />}
        />
        <Input
          label="Phone (optional)"
          type="tel"
          value={form.phone}
          onChange={update('phone')}
          placeholder="+1 234 567 8900"
          icon={<IconSmartphone size={16} className="text-text-muted" />}
        />
        {error && (
          <div className="p-4 rounded-2xl bg-pastel-peach-light text-xs font-bold text-accent-red border border-accent-red/10 animate-shake">
            {error}
          </div>
        )}
        <Button type="submit" className="w-full !py-4 shadow-soft" loading={loading}>
          Create Account
        </Button>
      </form>
      <p className="text-center text-sm text-text-secondary mt-8 font-medium">
        Already have an account?{' '}
        <Link to="/login" className="text-accent-purple font-bold hover:underline decoration-2 underline-offset-4">Sign in</Link>
      </p>
    </Card>
  );
}
