import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

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
    <Card className="animate-slide-up">
      <h2 className="text-xl font-bold text-text-primary mb-1">Create account</h2>
      <p className="text-sm text-text-muted mb-5">Start protecting your belongings</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          value={form.name}
          onChange={update('name')}
          required
          placeholder="John Doe"
          icon={<span className="text-sm">👤</span>}
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={update('email')}
          required
          placeholder="you@example.com"
          icon={<span className="text-sm">📧</span>}
        />
        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={update('password')}
          required
          minLength={6}
          placeholder="At least 6 characters"
          icon={<span className="text-sm">🔒</span>}
        />
        <Input
          label="Phone (optional)"
          type="tel"
          value={form.phone}
          onChange={update('phone')}
          placeholder="+1 234 567 8900"
          icon={<span className="text-sm">📱</span>}
        />
        {error && (
          <div className="p-3 rounded-2xl bg-pastel-peach-light text-sm text-red-600">
            {error}
          </div>
        )}
        <Button type="submit" className="w-full" loading={loading}>
          Create Account
        </Button>
      </form>
      <p className="text-center text-sm text-text-secondary mt-5">
        Already have an account?{' '}
        <Link to="/login" className="text-accent-purple font-semibold hover:underline">Sign in</Link>
      </p>
    </Card>
  );
}
