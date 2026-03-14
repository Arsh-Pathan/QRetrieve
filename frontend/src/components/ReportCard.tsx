import React from 'react';
import { Report } from '../services/report.service';
import { Card } from './ui/Card';
import { IconMapPin, IconMessageCircle, IconCalendar } from './ui/Symbols';

interface ReportCardProps {
  report: Report;
  onViewMap?: () => void;
}

export function ReportCard({ report, onViewMap }: ReportCardProps) {
  return (
    <Card hoverable className="!p-5 border border-cream-100 hover:border-pastel-lavender transition-all">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pastel-peach to-pastel-peach-light flex items-center justify-center flex-shrink-0 shadow-soft">
          <span className="text-base font-black text-accent-coral">
            {report.finderName.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <div>
                <h3 className="font-bold text-text-primary text-base leading-tight">{report.finderName}</h3>
                <div className="flex items-center gap-1.5 text-[10px] text-text-muted mt-1 uppercase font-bold tracking-wider">
                  <IconCalendar size={10} />
                  {new Date(report.createdAt).toLocaleDateString(undefined, {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })}
                </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-text-secondary mb-3 font-medium">
            <IconMapPin size={14} className="text-accent-blue" />
            <span className="truncate">{report.finderLocation}</span>
          </div>

          {report.message && (
            <div className="relative mt-2 bg-cream-50/50 rounded-2xl p-4 border-l-4 border-pastel-blue animate-fade-in">
              <IconMessageCircle size={14} className="absolute -left-2.5 top-3 text-accent-blue" />
              <p className="text-sm text-text-secondary leading-relaxed italic font-medium">
                "{report.message}"
              </p>
            </div>
          )}

          {report.photoUrl && (
            <div className="mt-4 rounded-2xl overflow-hidden border-2 border-white shadow-soft">
              <img
                src={report.photoUrl}
                alt="Found item"
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}

          {report.latitude && report.longitude && onViewMap && (
            <button
              onClick={onViewMap}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl 
                bg-pastel-blue-light text-accent-blue text-xs font-bold 
                hover:bg-accent-blue hover:text-white transition-all shadow-soft"
            >
              <IconMapPin size={14} /> View Found Location
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
