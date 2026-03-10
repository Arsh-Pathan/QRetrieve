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
    <Card>
      <h2 className="text-xl font-bold text-text-primary mb-6">Create account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Full Name" value={form.name} onChange={update('name')} required />
        <Input label="Email" type="email" value={form.email} onChange={update('email')} required />
        <Input label="Password" type="password" value={form.password} onChange={update('password')} required minLength={6} />
        <Input label="Phone (optional)" type="tel" value={form.phone} onChange={update('phone')} />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>
      <p className="text-center text-sm text-text-secondary mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-accent-coral font-medium hover:underline">Sign in</Link>
      </p>
    </Card>
  );
}
