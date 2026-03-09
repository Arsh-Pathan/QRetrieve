import React, { useState } from 'react';
import { createItem } from '../services/api';
import QRGeneratorWidget from '../components/QRGeneratorWidget';
import { useNotification } from '../hooks/useNotification';
import './HomePage.css';

function HomePage() {
  const [ownerName, setOwnerName] = useState('');
  const [ownerContact, setOwnerContact] = useState('');
  const [itemName, setItemName] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdItem, setCreatedItem] = useState(null);
  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createItem({ ownerName, ownerContact, itemName });
      setCreatedItem(result.item);
      showNotification({
        type: 'success',
        title: 'Item Registered!',
        message: `"${result.item.itemName}" has been registered. Download the QR code below.`,
      });
    } catch (err) {
      showNotification({
        type: 'error',
        title: 'Registration Failed',
        message: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setOwnerName('');
    setOwnerContact('');
    setItemName('');
    setCreatedItem(null);
  };

  return (
    <div className="home-page animate-fade">
      <div className="hero-section">
        <h1 className="page-title">Scan it. Find it. Return it.</h1>
        <p className="page-subtitle">
          Register your belongings with a QR code tag. If someone finds your item,
          they scan the code and you get notified instantly.
        </p>
      </div>

      {!createdItem ? (
        <div className="register-card card">
          <h2 className="register-heading">Register an Item</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                className="form-control"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-group">
              <label>Email or Phone</label>
              <input
                type="text"
                className="form-control"
                value={ownerContact}
                onChange={(e) => setOwnerContact(e.target.value)}
                placeholder="john@example.com or +1234567890"
                required
              />
            </div>

            <div className="form-group">
              <label>Item Name</label>
              <input
                type="text"
                className="form-control"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Blue Backpack, Laptop, Keys..."
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary register-btn"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Generate QR Tag'}
            </button>
          </form>
        </div>
      ) : (
        <div className="result-section animate-fade">
          <div className="success-banner card">
            <span className="success-check">&#10003;</span>
            <div>
              <h3>Item Registered Successfully</h3>
              <p>Print the QR code and attach it to your item.</p>
            </div>
          </div>

          <QRGeneratorWidget
            itemId={createdItem.itemId}
            itemName={createdItem.itemName}
          />

          <button className="btn btn-secondary register-another" onClick={handleReset}>
            Register Another Item
          </button>
        </div>
      )}
    </div>
  );
}

export default HomePage;
