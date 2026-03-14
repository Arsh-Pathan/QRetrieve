import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { IconMail, IconLock } from '../components/ui/Symbols';

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
    <Card className="animate-slide-up !p-8 shadow-glow-purple/10">
      <div className="mb-8 overflow-hidden">
        <h2 className="text-2xl font-black text-text-primary mb-1">Welcome Back</h2>
        <p className="text-sm text-text-muted">Sign in to manage your items</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          icon={<IconMail size={16} className="text-text-muted" />}
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          icon={<IconLock size={16} className="text-text-muted" />}
        />
        {error && (
          <div className="p-4 rounded-2xl bg-pastel-peach-light text-xs font-bold text-accent-red border border-accent-red/10 animate-shake">
            {error}
          </div>
        )}
        <Button type="submit" className="w-full !py-4 shadow-soft" loading={loading}>
          Sign In
        </Button>
      </form>
      <p className="text-center text-sm text-text-secondary mt-8 font-medium">
        Don't have an account?{' '}
        <Link to="/register" className="text-accent-purple font-bold hover:underline decoration-2 underline-offset-4">Sign up</Link>
      </p>
    </Card>
  );
}
