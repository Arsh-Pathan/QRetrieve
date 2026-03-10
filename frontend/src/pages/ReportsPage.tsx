import React, { useState } from 'react';
import { useReports } from '../hooks/useReports';
import { ReportCard } from '../components/ReportCard';
import { MapView } from '../components/MapView';
import { Card } from '../components/ui/Card';

export function ReportsPage() {
  const { reports, loading } = useReports();
  const [mapReport, setMapReport] = useState<{ lat: number; lng: number; label: string } | null>(null);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-text-primary">Found Reports</h1>

      {mapReport && (
        <div>
          <button onClick={() => setMapReport(null)} className="text-sm text-text-muted hover:underline mb-2">
            Close Map
          </button>
          <MapView lat={mapReport.lat} lng={mapReport.lng} label={mapReport.label} />
        </div>
      )}

      {loading ? (
        <p className="text-center text-text-muted py-8">Loading reports...</p>
      ) : reports.length === 0 ? (
        <Card className="text-center py-8">
          <p className="text-text-muted">No reports yet.</p>
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
