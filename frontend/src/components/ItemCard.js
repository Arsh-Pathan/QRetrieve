import React, { useState } from 'react';
import QRGeneratorWidget from './QRGeneratorWidget';
import '../styles/ItemCard.css';

function ItemCard({ item }) {
  const [showQR, setShowQR] = useState(false);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="item-card card animate-fade">
      <div className="item-card-header">
        <div>
          <h3 className="item-card-name">{item.itemName}</h3>
          <p className="item-card-id">ID: {item.itemId}</p>
        </div>
        <span className={`badge badge-${item.status}`}>
          {item.status}
        </span>
      </div>

      <div className="item-card-details">
        <div className="item-detail">
          <span className="item-detail-label">Owner</span>
          <span>{item.ownerName}</span>
        </div>
        <div className="item-detail">
          <span className="item-detail-label">Contact</span>
          <span>{item.ownerContact}</span>
        </div>
        <div className="item-detail">
          <span className="item-detail-label">Registered</span>
          <span>{formatDate(item.createdAt)}</span>
        </div>
      </div>

      <button
        className="btn btn-secondary btn-sm"
        onClick={() => setShowQR(!showQR)}
      >
        {showQR ? 'Hide QR Code' : 'View QR Code'}
      </button>

      {showQR && (
        <div className="item-qr-section animate-fade">
          <QRGeneratorWidget itemId={item.itemId} itemName={item.itemName} />
        </div>
      )}
    </div>
  );
}

export default ItemCard;
