import React from 'react';
import { useNotification } from '../hooks/useNotification';
import '../styles/NotificationPopup.css';

function NotificationPopup() {
  const { notification, dismissNotification } = useNotification();

  if (!notification) return null;

  return (
    <div className={`notification-overlay animate-fade`}>
      <div className="notification-popup animate-slide">
        <button className="notification-close" onClick={dismissNotification}>
          &times;
        </button>

        <div className="notification-header">
          <div className="notification-icon">
            {notification.type === 'found' ? '📍' : '✓'}
          </div>
          <h3 className="notification-title">
            {notification.title || 'Your item has been found!'}
          </h3>
        </div>

        {notification.data && (
          <div className="notification-details">
            {notification.data.finderName && (
              <div className="detail-row">
                <span className="detail-label">Finder</span>
                <span className="detail-value">{notification.data.finderName}</span>
              </div>
            )}
            {notification.data.finderLocation && (
              <div className="detail-row">
                <span className="detail-label">Location</span>
                <span className="detail-value">{notification.data.finderLocation}</span>
              </div>
            )}
            {notification.data.message && (
              <div className="detail-row">
                <span className="detail-label">Message</span>
                <span className="detail-value">{notification.data.message}</span>
              </div>
            )}
            {notification.data.finderContact && (
              <div className="detail-row">
                <span className="detail-label">Contact</span>
                <span className="detail-value">{notification.data.finderContact}</span>
              </div>
            )}
          </div>
        )}

        {notification.message && (
          <p className="notification-message">{notification.message}</p>
        )}

        <button className="btn btn-primary" onClick={dismissNotification}>
          Got it
        </button>
      </div>
    </div>
  );
}

export default NotificationPopup;
