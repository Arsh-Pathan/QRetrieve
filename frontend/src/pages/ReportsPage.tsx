import React, { useState } from 'react';
import { useReports } from '../hooks/useReports';
import { ReportCard } from '../components/ReportCard';
import { MapView } from '../components/MapView';
import { Card } from '../components/ui/Card';
import { EmptyStateIllustration } from '../components/illustrations/SVGIllustrations';

export function ReportsPage() {
  const { reports, loading } = useReports();
  const [mapReport, setMapReport] = useState<{ lat: number; lng: number; label: string } | null>(null);

  // Aggregate map data
  const reportsWithCoords = reports.filter((r) => r.latitude && r.longitude);

  return (
    <div className="space-y-5 animate-slide-up">
      <div>
        <h1 className="text-2xl font-extrabold text-text-primary">Found Reports</h1>
        <p className="text-text-secondary text-sm mt-0.5">
          {reports.length} report{reports.length !== 1 ? 's' : ''} received
        </p>
      </div>

      {/* Stats row */}
      {reports.length > 0 && (
        <div className="flex gap-3">
          <Card pastel="peach" className="flex-1 text-center !p-3">
            <p className="text-2xl font-extrabold text-text-primary">{reports.length}</p>
            <p className="text-[10px] text-text-secondary font-medium">Total</p>
          </Card>
          <Card pastel="blue" className="flex-1 text-center !p-3">
            <p className="text-2xl font-extrabold text-text-primary">{reportsWithCoords.length}</p>
            <p className="text-[10px] text-text-secondary font-medium">With Location</p>
          </Card>
        </div>
      )}

      {/* Map */}
      {mapReport && (
        <div className="animate-scale-in">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
              🗺️ Found Location
            </h2>
            <button
              onClick={() => setMapReport(null)}
              className="text-xs text-text-muted hover:text-text-primary transition-colors"
            >
              ✕ Close
            </button>
          </div>
          <MapView lat={mapReport.lat} lng={mapReport.lng} label={mapReport.label} />
        </div>
      )}

      {/* Reports list */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-3 border-accent-purple border-t-transparent rounded-full animate-spin" />
          <p className="text-text-muted mt-3 text-sm">Loading reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <Card className="text-center !py-12">
          <div className="flex justify-center mb-4">
            <EmptyStateIllustration size={140} />
          </div>
          <p className="text-text-secondary font-semibold text-lg">No reports yet</p>
          <p className="text-text-muted text-sm mt-1">Reports will appear here when someone scans your QR code</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <ReportCard
              key={report._id}
              report={report}
              onViewMap={
                report.latitude && report.longitude
                  ? () => setMapReport({ lat: report.latitude!, lng: report.longitude!, label: report.finderLocation })
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
