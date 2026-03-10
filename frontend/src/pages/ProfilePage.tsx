import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-text-primary">Profile</h1>
      <Card className="space-y-4">
        <div>
          <p className="text-sm text-text-muted">Name</p>
          <p className="font-medium text-text-primary">{user?.name}</p>
        </div>
        <div>
          <p className="text-sm text-text-muted">Email</p>
          <p className="font-medium text-text-primary">{user?.email}</p>
        </div>
        {user?.phone && (
          <div>
            <p className="text-sm text-text-muted">Phone</p>
            <p className="font-medium text-text-primary">{user.phone}</p>
          </div>
        )}
        <Button variant="danger" onClick={logout} className="w-full">
          Sign Out
        </Button>
      </Card>
    </div>
  );
}
