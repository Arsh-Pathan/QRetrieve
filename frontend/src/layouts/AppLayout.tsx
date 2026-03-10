import React from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from '../components/BottomNav';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-beige-50 pb-20">
      <div className="max-w-lg mx-auto px-4 py-6">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
