import React from 'react';
import '../styles/ReportCard.css';

function ReportCard({ report }) {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="report-card card animate-fade">
      <div className="report-card-header">
        <span className="report-badge">Found Report</span>
        <span className="report-date">{formatDate(report.createdAt)}</span>
      </div>

      <div className="report-details">
        <div className="report-row">
          <span className="report-label">Item ID</span>
          <span className="report-value mono">{report.itemId}</span>
        </div>
        <div className="report-row">
          <span className="report-label">Finder</span>
          <span className="report-value">{report.finderName}</span>
        </div>
        <div className="report-row">
          <span className="report-label">Location</span>
          <span className="report-value">{report.finderLocation}</span>
        </div>
        {report.finderContact && (
          <div className="report-row">
            <span className="report-label">Contact</span>
            <span className="report-value">{report.finderContact}</span>
          </div>
        )}
        {report.message && (
          <div className="report-row">
            <span className="report-label">Message</span>
            <span className="report-value">{report.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportCard;
