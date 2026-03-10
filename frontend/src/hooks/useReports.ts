import { useState, useEffect, useCallback } from 'react';
import { reportService, Report } from '../services/report.service';

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reportService.getMyReports(page);
      setReports(res.reports);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  return { reports, loading, page, totalPages, setPage, refresh: fetchReports };
}
