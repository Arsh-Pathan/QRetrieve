import React from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from '../components/BottomNav';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-cream-50 pb-24">
      <div className="max-w-lg mx-auto px-4 pt-6 pb-4">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
