import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { colors, spacing, radius, fonts, shadows } from '../../constants/theme';

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ total: 0, safe: 0, found: 0 });
  const [notifications, setNotifications] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [reports, setReports] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const [itemsRes, notifsRes, reportsRes] = await Promise.all([
        api.get<{ items: any[] }>('/items?limit=100'),
        api.get<{ notifications: any[]; unreadCount: number }>('/notifications'),
        api.get<{ reports: any[] }>('/reports?limit=5'),
      ]);
      const itemList = itemsRes.items;
      setStats({
        total: itemList.length,
        safe: itemList.filter((i: any) => i.status === 'safe').length,
        found: itemList.filter((i: any) => i.status === 'found').length,
      });
      setNotifications(notifsRes.notifications.filter((n: any) => !n.read).slice(0, 5));
      setReports(reportsRes.reports || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const safePercent = stats.total > 0 ? Math.round((stats.safe / stats.total) * 100) : 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <Text style={styles.greeting}>{greeting}, {user?.name?.split(' ')[0]} 👋</Text>
        <Text style={styles.sub}>Manage your items & recover lost belongings faster.</Text>

        {/* Status Row */}
        <View style={styles.statusRow}>
          {[
            { emoji: '🛡️', label: 'Safe', active: stats.safe === stats.total && stats.total > 0 },
            { emoji: '📍', label: 'Found', active: stats.found > 0 },
            { emoji: '🔔', label: 'Alerts', active: notifications.length > 0 },
            { emoji: '✅', label: 'Good', active: stats.found === 0 && stats.total > 0 },
          ].map((s) => (
            <View key={s.label} style={[styles.statusChip, s.active && styles.statusChipActive]}>
              <Text style={{ fontSize: 18 }}>{s.emoji}</Text>
              <Text style={styles.statusLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {[
            { label: 'Total Items', value: stats.total, icon: '📦', bg: colors.pastel.lavenderLight },
            { label: 'Safe', value: stats.safe, icon: '🛡️', bg: colors.pastel.sageLight },
            { label: 'Found', value: stats.found, icon: '📍', bg: colors.pastel.peachLight },
            { label: 'Reports', value: reports.length, icon: '📋', bg: colors.pastel.blueLight },
          ].map((stat) => (
            <View key={stat.label} style={[styles.statCard, { backgroundColor: stat.bg }]}>
              <Text style={{ fontSize: 20 }}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {[
            { label: 'Register', icon: '➕', desc: 'Add new item', bg: colors.pastel.sageLight, route: '/(tabs)/items' },
            { label: 'Scan QR', icon: '📷', desc: 'Scan a code', bg: colors.pastel.lavenderLight, route: '/(tabs)/scanner' },
            { label: 'Reports', icon: '📋', desc: 'View found', bg: colors.pastel.peachLight, route: '/(tabs)/reports' },
            { label: 'Profile', icon: '👤', desc: 'Settings', bg: colors.pastel.blueLight, route: '/(tabs)/profile' },
          ].map((action) => (
            <TouchableOpacity
              key={action.label}
              style={[styles.actionCard, { backgroundColor: action.bg }]}
              onPress={() => router.push(action.route as any)}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 24, marginBottom: 6 }}>{action.icon}</Text>
              <Text style={styles.actionLabel}>{action.label}</Text>
              <Text style={styles.actionDesc}>{action.desc}</Text>
              <View style={styles.actionArrow}>
                <Text style={{ fontSize: 12, color: colors.text.primary }}>→</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Progress Card */}
        {stats.total > 0 && (
          <View style={styles.progressCard}>
            <Text style={styles.sectionTitle}>📊 Recovery Overview</Text>
            <View style={styles.progressRow}>
              <View style={styles.progressCircle}>
                <Text style={styles.progressPercent}>{safePercent}%</Text>
                <Text style={styles.progressSubtext}>Protected</Text>
              </View>
              <View style={{ flex: 1, marginLeft: spacing.xl }}>
                <Text style={fonts.small}>Items protected</Text>
                <Text style={[fonts.muted, { marginTop: spacing.sm }]}>
                  <Text style={{ color: colors.accent.green, fontWeight: '700' }}>{stats.safe} safe</Text>
                  {' · '}
                  <Text style={{ color: colors.accent.blue, fontWeight: '700' }}>{stats.found} found</Text>
                  {' · '}
                  <Text style={{ fontWeight: '700' }}>{stats.total} total</Text>
                </Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${safePercent}%` }]} />
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Notifications */}
        {notifications.length > 0 && (
          <View style={styles.notifBanner}>
            <View style={styles.notifIcon}>
              <Text style={{ fontSize: 16 }}>🔔</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[fonts.regular, { fontWeight: '600' }]}>
                {notifications.length} unread notification{notifications.length > 1 ? 's' : ''}
              </Text>
              <Text style={fonts.muted}>Tap to view details</Text>
            </View>
          </View>
        )}

        {/* Activity */}
        {(reports.length > 0 || notifications.length > 0) && (
          <View>
            <Text style={styles.sectionTitle}>🕐 Activity</Text>
            <View style={styles.card}>
              {[...reports.slice(0, 3).map((r: any) => ({
                id: r._id,
                icon: '📍',
                title: `${r.finderName} found an item`,
                sub: r.finderLocation,
                time: r.createdAt,
                bg: colors.pastel.peachLight,
              })),
              ...notifications.slice(0, 2).map((n: any) => ({
                id: n._id,
                icon: '🔔',
                title: n.title,
                sub: n.body,
                time: n.createdAt,
                bg: colors.pastel.lavenderLight,
              }))]
              .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
              .slice(0, 4)
              .map((event, i, arr) => (
                <View key={event.id} style={[styles.timelineItem, i < arr.length - 1 && styles.timelineBorder]}>
                  <View style={[styles.timelineIcon, { backgroundColor: event.bg }]}>
                    <Text style={{ fontSize: 12 }}>{event.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[fonts.regular, { fontWeight: '600', fontSize: 13 }]}>{event.title}</Text>
                    <Text style={[fonts.muted, { marginTop: 2 }]} numberOfLines={1}>{event.sub}</Text>
                    <Text style={[styles.timelineTime]}>
                      {new Date(event.time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: spacing.xxl, paddingBottom: spacing.xxxl * 2 },
  greeting: { ...fonts.heading },
  sub: { ...fonts.small, marginBottom: spacing.xl, marginTop: spacing.xs },

  statusRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  statusChip: { flexDirection: 'column', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.md, backgroundColor: colors.cream[100], gap: 2 },
  statusChipActive: { backgroundColor: colors.pastel.sageLight, borderWidth: 2, borderColor: colors.accent.green + '40' },
  statusLabel: { fontSize: 10, fontWeight: '600', color: colors.text.secondary },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  statCard: { width: '47%', borderRadius: radius.md, padding: spacing.lg, alignItems: 'center', ...shadows.card },
  statValue: { fontSize: 28, fontWeight: '800', color: colors.text.primary, marginTop: spacing.xs },
  statLabel: { fontSize: 10, fontWeight: '600', color: colors.text.secondary, marginTop: 2 },

  sectionTitle: { ...fonts.subheading, marginTop: spacing.xxl, marginBottom: spacing.md },

  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  actionCard: { width: '47%', borderRadius: radius.md, padding: spacing.lg, ...shadows.soft },
  actionLabel: { fontWeight: '700', fontSize: 14, color: colors.text.primary },
  actionDesc: { fontSize: 11, color: colors.text.secondary, marginTop: 2 },
  actionArrow: { position: 'absolute', bottom: spacing.md, right: spacing.md, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.6)', justifyContent: 'center', alignItems: 'center' },

  progressCard: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.xxl, marginTop: spacing.md, ...shadows.card },
  progressRow: { flexDirection: 'row', alignItems: 'center' },
  progressCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.pastel.lavenderLight, justifyContent: 'center', alignItems: 'center' },
  progressPercent: { fontSize: 22, fontWeight: '800', color: colors.text.primary },
  progressSubtext: { fontSize: 9, color: colors.text.muted, fontWeight: '600' },
  progressBar: { height: 6, backgroundColor: colors.cream[200], borderRadius: 100, marginTop: spacing.md, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 100, backgroundColor: colors.primary },

  notifBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.pastel.peachLight, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.md, gap: spacing.md },
  notifIcon: { width: 40, height: 40, borderRadius: radius.sm, backgroundColor: 'rgba(255,255,255,0.6)', justifyContent: 'center', alignItems: 'center' },

  card: { backgroundColor: colors.white, borderRadius: radius.md, padding: spacing.lg, ...shadows.soft },
  timelineItem: { flexDirection: 'row', gap: spacing.md, paddingVertical: spacing.md },
  timelineBorder: { borderBottomWidth: 1, borderBottomColor: colors.cream[100] },
  timelineIcon: { width: 36, height: 36, borderRadius: radius.sm, justifyContent: 'center', alignItems: 'center' },
  timelineTime: { fontSize: 10, color: colors.text.muted, marginTop: 4 },
});
