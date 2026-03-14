import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="animate-slide-up">
      <h2 className="text-xl font-bold text-text-primary mb-1">Welcome back</h2>
      <p className="text-sm text-text-muted mb-5">Sign in to manage your items</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          icon={<span className="text-sm">📧</span>}
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          icon={<span className="text-sm">🔒</span>}
        />
        {error && (
          <div className="p-3 rounded-2xl bg-pastel-peach-light text-sm text-red-600">
            {error}
          </div>
        )}
        <Button type="submit" className="w-full" loading={loading}>
          Sign In
        </Button>
      </form>
      <p className="text-center text-sm text-text-secondary mt-5">
        Don't have an account?{' '}
        <Link to="/register" className="text-accent-purple font-semibold hover:underline">Sign up</Link>
      </p>
    </Card>
  );
}
