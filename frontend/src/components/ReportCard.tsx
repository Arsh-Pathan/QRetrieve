import React from 'react';
import { Report } from '../services/report.service';
import { Card } from './ui/Card';

interface ReportCardProps {
  report: Report;
  onViewMap?: () => void;
}

export function ReportCard({ report, onViewMap }: ReportCardProps) {
  return (
    <Card hoverable className="!p-4">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-xl bg-pastel-peach-light flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-accent-coral">
            {report.finderName.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-text-primary text-sm">{report.finderName}</h3>
            <span className="text-[10px] text-text-muted flex-shrink-0 ml-2">
              {new Date(report.createdAt).toLocaleDateString(undefined, {
                month: 'short', day: 'numeric',
              })}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-text-secondary mb-1">
            <span>📍</span>
            <span className="truncate">{report.finderLocation}</span>
          </div>

          {report.message && (
            <p className="text-xs text-text-muted mt-1 bg-cream-50 rounded-xl px-3 py-2 italic">
              "{report.message}"
            </p>
          )}

          {report.photoUrl && (
            <img
              src={report.photoUrl}
              alt="Found item"
              className="w-full h-36 rounded-2xl object-cover mt-2"
            />
          )}

          {report.latitude && report.longitude && onViewMap && (
            <button
              onClick={onViewMap}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl 
                bg-pastel-blue-light text-accent-blue text-xs font-semibold 
                hover:bg-pastel-blue transition-all"
            >
              🗺️ View on Map
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
