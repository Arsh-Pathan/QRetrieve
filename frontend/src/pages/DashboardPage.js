import React, { useState, useEffect, useCallback } from 'react';
import { getItems, getReports } from '../services/api';
import ItemCard from '../components/ItemCard';
import ReportCard from '../components/ReportCard';
import { useNotification } from '../hooks/useNotification';
import './DashboardPage.css';

function DashboardPage() {
  const [activeTab, setActiveTab] = useState('items');
  const [items, setItems] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [itemsData, reportsData] = await Promise.all([
        getItems(),
        getReports(),
      ]);
      setItems(itemsData);
      setReports(reportsData);

      // Show notification if there are new found reports
      const foundItems = itemsData.filter((i) => i.status === 'found');
      if (foundItems.length > 0 && reportsData.length > 0) {
        const latestReport = reportsData[0];
        showNotification({
          type: 'found',
          title: 'Your item has been found!',
          data: {
            finderName: latestReport.finderName,
            finderLocation: latestReport.finderLocation,
            finderContact: latestReport.finderContact,
            message: latestReport.message,
          },
        });
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const tabs = [
    { key: 'items', label: 'Items', count: items.length },
    { key: 'reports', label: 'Reports', count: reports.length },
    { key: 'downloads', label: 'QR Downloads', count: null },
  ];

  return (
    <div className="dashboard-page animate-fade">
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Manage your registered items and view found reports</p>

      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            {tab.count !== null && (
              <span className="tab-count">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading...</p>
        </div>
      ) : (
        <>
          {activeTab === 'items' && (
            <div className="grid grid-2">
              {items.length === 0 ? (
                <div className="empty-state card">
                  <p>No items registered yet. Go to the home page to register your first item.</p>
                </div>
              ) : (
                items.map((item) => (
                  <ItemCard key={item.itemId} item={item} />
                ))
              )}
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="grid grid-2">
              {reports.length === 0 ? (
                <div className="empty-state card">
                  <p>No found reports yet. Reports appear here when someone scans your QR code.</p>
                </div>
              ) : (
                reports.map((report) => (
                  <ReportCard key={report.reportId} report={report} />
                ))
              )}
            </div>
          )}

          {activeTab === 'downloads' && (
            <div className="grid grid-2">
              {items.length === 0 ? (
                <div className="empty-state card">
                  <p>Register items first to generate downloadable QR codes.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.itemId} className="card">
                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>
                      {item.itemName}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      ID: {item.itemId}
                    </p>
                    <ItemCard item={item} />
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default DashboardPage;
