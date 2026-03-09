import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, Pressable, ScrollView, RefreshControl,
  ActivityIndicator, StyleSheet,
} from 'react-native';
import { getItems, getReports } from '../services/api';
import { useNotification } from '../hooks/useNotification';
import ItemCard from '../components/ItemCard';
import ReportCard from '../components/ReportCard';
import { colors, spacing, radius, fonts } from '../constants/theme';

const TABS = ['Items', 'Reports'];

export default function DashboardScreen() {
  const [activeTab, setActiveTab] = useState(0);
  const [items, setItems] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { showNotification } = useNotification();

  const fetchData = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    try {
      const [itemsData, reportsData] = await Promise.all([
        getItems(),
        getReports(),
      ]);
      setItems(itemsData);
      setReports(reportsData);

      const foundItems = itemsData.filter((i) => i.status === 'found');
      if (foundItems.length > 0 && reportsData.length > 0 && !isRefresh) {
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
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData(true);
  };

  return (
    <View style={styles.flex}>
      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {TABS.map((tab, i) => {
          const count = i === 0 ? items.length : reports.length;
          return (
            <Pressable
              key={tab}
              style={[styles.tab, activeTab === i && styles.tabActive]}
              onPress={() => setActiveTab(i)}
            >
              <Text style={[styles.tabTxt, activeTab === i && styles.tabTxtActive]}>
                {tab}
              </Text>
              <View style={[styles.tabCount, activeTab === i && styles.tabCountActive]}>
                <Text style={[styles.tabCountTxt, activeTab === i && styles.tabCountTxtActive]}>
                  {count}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingTxt}>Loading...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
          }
        >
          {activeTab === 0 && (
            items.length === 0 ? (
              <EmptyState text="No items registered yet. Go to Register tab to add your first item." />
            ) : (
              items.map((item) => <ItemCard key={item.itemId} item={item} />)
            )
          )}

          {activeTab === 1 && (
            reports.length === 0 ? (
              <EmptyState text="No found reports yet. Reports appear here when someone scans your QR code." />
            ) : (
              reports.map((report) => <ReportCard key={report.reportId} report={report} />)
            )
          )}
        </ScrollView>
      )}
    </View>
  );
}

function EmptyState({ text }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTxt}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bgStart },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(108,99,255,0.06)',
    margin: spacing.lg,
    marginBottom: 0,
    borderRadius: radius.sm,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing.md,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: colors.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  tabTxt: { fontSize: 14, fontWeight: '500', color: colors.textMuted },
  tabTxtActive: { color: colors.primary, fontWeight: '600' },
  tabCount: {
    backgroundColor: 'rgba(108,99,255,0.1)',
    borderRadius: 10,
    minWidth: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  tabCountActive: { backgroundColor: 'rgba(108,99,255,0.15)' },
  tabCountTxt: { fontSize: 11, fontWeight: '700', color: colors.textMuted },
  tabCountTxtActive: { color: colors.primary },
  list: { padding: spacing.lg, paddingTop: spacing.lg },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingTxt: { ...fonts.muted, marginTop: spacing.md },
  empty: {
    padding: spacing.xxxl,
    alignItems: 'center',
  },
  emptyTxt: { ...fonts.small, textAlign: 'center', lineHeight: 20 },
});
