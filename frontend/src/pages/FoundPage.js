import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getItemByItemId, submitReport } from '../services/api';
import FoundReportForm from '../components/FoundReportForm';
import '../styles/FoundPage.css';

function FoundPage() {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await getItemByItemId(itemId);
        setItem(data);
      } catch (err) {
        setError('This item was not found in our system.');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [itemId]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await submitReport(formData);
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="found-page">
        <div className="loading-state">
          <div className="spinner" />
          <p>Looking up item...</p>
        </div>
      </div>
    );
  }

  if (error && !item) {
    return (
      <div className="found-page">
        <div className="error-card card">
          <h2>Item Not Found</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="found-page animate-fade">
        <div className="thank-you-card card">
          <div className="thank-you-icon">&#10003;</div>
          <h2>Thank You!</h2>
          <p>
            Your report has been submitted successfully. The owner of
            <strong> {item.itemName}</strong> has been notified and will
            reach out to you soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="found-page animate-fade">
      <div className="card">
        <FoundReportForm
          itemId={itemId}
          itemName={item.itemName}
          onSubmit={handleSubmit}
          isSubmitting={submitting}
        />
      </div>
    </div>
  );
}

export default FoundPage;
