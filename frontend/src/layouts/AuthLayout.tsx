import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function AuthLayout() {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen text-text-muted">Loading...</div>;
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-beige-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary">QRetrieve</h1>
          <p className="text-text-secondary mt-1">Never lose what matters</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
