import React, { useState } from 'react';
import { useReports } from '../hooks/useReports';
import { ReportCard } from '../components/ReportCard';
import { MapView } from '../components/MapView';
import { Card } from '../components/ui/Card';
import { EmptyStateIllustration } from '../components/illustrations/SVGIllustrations';
import { IconMapPin, IconBell, IconActivity } from '../components/ui/Symbols';

export function ReportsPage() {
  const { reports, loading } = useReports();
  const [mapReport, setMapReport] = useState<{ lat: number; lng: number; label: string } | null>(null);

  // Aggregate map data
  const reportsWithCoords = reports.filter((r) => r.latitude && r.longitude);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary">Found Reports</h1>
          <p className="text-text-secondary text-sm mt-0.5">
            {reports.length} report{reports.length !== 1 ? 's' : ''} received via QR scans
          </p>
        </div>
        <div className="p-2 bg-white rounded-2xl shadow-soft">
           <IconBell size={20} className="text-accent-coral" />
        </div>
      </div>

      {/* Stats row */}
      {reports.length > 0 && (
        <div className="flex gap-4">
          <Card pastel="peach" className="flex-1 !p-4 flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-xl bg-white/60 flex items-center justify-center mb-2">
                <IconActivity size={16} className="text-accent-coral" />
            </div>
            <p className="text-2xl font-black text-text-primary leading-none">{reports.length}</p>
            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mt-1.5">Total Reports</p>
          </Card>
          <Card pastel="blue" className="flex-1 !p-4 flex flex-col items-center justify-center">
             <div className="w-8 h-8 rounded-xl bg-white/60 flex items-center justify-center mb-2">
                <IconMapPin size={16} className="text-accent-blue" />
            </div>
            <p className="text-2xl font-black text-text-primary leading-none">{reportsWithCoords.length}</p>
            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mt-1.5">With Location</p>
          </Card>
        </div>
      )}

      {/* Map */}
      {mapReport && (
        <div className="animate-scale-in">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <IconMapPin size={18} className="text-accent-blue" /> Found Location
            </h2>
            <button
              onClick={() => setMapReport(null)}
              className="px-3 py-1 rounded-full bg-cream-200 text-[10px] font-bold text-text-muted hover:bg-cream-300 hover:text-text-primary transition-all uppercase tracking-wide"
            >
              ✕ Close Map
            </button>
          </div>
          <div className="rounded-[2rem] overflow-hidden shadow-card border-4 border-white">
            <MapView lat={mapReport.lat} lng={mapReport.lng} label={mapReport.label} />
          </div>
        </div>
      )}

      {/* Reports list */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-3 border-accent-purple border-t-transparent rounded-full animate-spin" />
          <p className="text-text-muted mt-3 text-sm font-medium">Loading reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <Card className="text-center !py-16 !bg-transparent border-2 border-dashed border-cream-200">
          <div className="flex justify-center mb-6">
            <EmptyStateIllustration size={160} className="opacity-60" />
          </div>
          <p className="text-text-primary font-bold text-xl">Quiet for now...</p>
          <p className="text-text-secondary text-sm mt-2 max-w-[240px] mx-auto">Reports will appear here once someone helps find your items.</p>
        </Card>
      ) : (
        <div className="space-y-4">
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
