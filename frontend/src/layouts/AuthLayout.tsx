import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { QRScanIllustration } from '../components/illustrations/SVGIllustrations';

export function AuthLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-cream-50">
        <div className="inline-block w-8 h-8 border-3 border-accent-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pastel-lavender-light to-cream-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <QRScanIllustration size={80} className="animate-float" />
          </div>
          <h1 className="text-3xl font-extrabold gradient-text">QRetrieve</h1>
          <p className="text-text-secondary mt-1 text-sm">Scan it. Find it. Return it.</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
