import React, { useState } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import './FoundReportForm.css';

function FoundReportForm({ itemId, itemName, onSubmit, isSubmitting }) {
  const [finderName, setFinderName] = useState('');
  const [finderContact, setFinderContact] = useState('');
  const [message, setMessage] = useState('');
  const { location, loading: geoLoading, getLocation, setLocation } = useGeolocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      itemId,
      finderName,
      finderLocation: location,
      finderContact,
      message,
    });
  };

  return (
    <form className="found-form" onSubmit={handleSubmit}>
      <div className="found-form-header">
        <div className="found-icon">📍</div>
        <div>
          <h2 className="found-title">This item is registered on QRetrieve</h2>
          <p className="found-subtitle">
            If you found <strong>{itemName}</strong>, please help return it.
          </p>
        </div>
      </div>

      <div className="form-group">
        <label>Your Name *</label>
        <input
          type="text"
          className="form-control"
          value={finderName}
          onChange={(e) => setFinderName(e.target.value)}
          placeholder="Enter your name"
          required
        />
      </div>

      <div className="form-group">
        <label>Current Location *</label>
        <div className="location-input-group">
          <input
            type="text"
            className="form-control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Where did you find this item?"
            required
          />
          <button
            type="button"
            className="btn btn-secondary btn-sm geo-btn"
            onClick={getLocation}
            disabled={geoLoading}
          >
            {geoLoading ? 'Locating...' : 'Use GPS'}
          </button>
        </div>
      </div>

      <div className="form-group">
        <label>Phone or Email (optional)</label>
        <input
          type="text"
          className="form-control"
          value={finderContact}
          onChange={(e) => setFinderContact(e.target.value)}
          placeholder="So the owner can reach you"
        />
      </div>

      <div className="form-group">
        <label>Message (optional)</label>
        <textarea
          className="form-control"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Any additional details..."
          rows={3}
        />
      </div>

      <button
        type="submit"
        className="btn btn-success submit-btn"
        disabled={isSubmitting || !finderName || !location}
      >
        {isSubmitting ? 'Submitting...' : 'Report Item Found'}
      </button>
    </form>
  );
}

export default FoundReportForm;
