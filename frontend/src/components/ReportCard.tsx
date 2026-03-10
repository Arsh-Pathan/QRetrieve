import React from 'react';
import { Report } from '../services/report.service';
import { Card } from './ui/Card';

interface ReportCardProps {
  report: Report;
  onViewMap?: () => void;
}

export function ReportCard({ report, onViewMap }: ReportCardProps) {
  return (
    <Card>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-text-primary">{report.finderName}</h3>
        <span className="text-xs text-text-muted">
          {new Date(report.createdAt).toLocaleDateString()}
        </span>
      </div>
      <p className="text-sm text-text-secondary mb-1">
        📍 {report.finderLocation}
      </p>
      {report.message && (
        <p className="text-sm text-text-secondary mb-2">{report.message}</p>
      )}
      {report.photoUrl && (
        <img src={report.photoUrl} alt="Found item" className="w-full h-40 rounded-2xl object-cover mb-2" />
      )}
      {report.latitude && report.longitude && onViewMap && (
        <button onClick={onViewMap} className="text-xs text-accent-blue font-medium hover:underline">
          View on Map
        </button>
      )}
    </Card>
  );
}
