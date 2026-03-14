import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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
        {/* Header Area */}
        <View style={styles.header}>
            <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.greeting}>{greeting}, {user?.name?.split(' ')[0]}</Text>
                    <Ionicons name="hand-left" size={20} color="#ffdb58" />
                </View>
                <Text style={styles.sub}>Manage your items & recover lost belongings faster.</Text>
            </View>
            <TouchableOpacity style={styles.profileBtn} onPress={() => router.push('/(tabs)/profile')}>
                <Ionicons name="person-circle" size={40} color={colors.primary} />
            </TouchableOpacity>
        </View>

        {/* Status Highlights */}
        <View style={styles.statusRow}>
          {[
            { icon: 'shield-checkmark', label: 'Safe', active: stats.safe === stats.total && stats.total > 0, color: colors.accent.green },
            { icon: 'location', label: 'Found', active: stats.found > 0, color: colors.accent.blue },
            { icon: 'notifications', label: 'Alerts', active: notifications.length > 0, color: colors.accent.coral },
            { icon: 'checkmark-circle', label: 'Good', active: stats.found === 0 && stats.total > 0, color: colors.accent.purple },
          ].map((s) => (
            <View key={s.label} style={[styles.statusChip, s.active && styles.statusChipActive]}>
              <Ionicons name={s.icon as any} size={18} color={s.active ? s.color : colors.text.muted} />
              <Text style={styles.statusLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {[
            { label: 'Total Items', value: stats.total, icon: 'cube', bg: colors.pastel.lavenderLight, color: colors.accent.purple },
            { label: 'Safe', value: stats.safe, icon: 'shield', bg: colors.pastel.sageLight, color: colors.accent.green },
            { label: 'Found', value: stats.found, icon: 'location', bg: colors.pastel.peachLight, color: colors.accent.red },
            { label: 'Reports', value: reports.length, icon: 'list', bg: colors.pastel.blueLight, color: colors.accent.blue },
          ].map((stat) => (
            <View key={stat.label} style={[styles.statCard, { backgroundColor: stat.bg }]}>
              <Ionicons name={stat.icon as any} size={22} color={stat.color} style={{ opacity: 0.8 }} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: spacing.xxl, marginBottom: spacing.md }}>
            <Ionicons name="flash" size={20} color={colors.accent.yellow} />
            <Text style={[fonts.subheading, { marginTop: 0, marginBottom: 0 }]}>Quick Actions</Text>
        </View>
        <View style={styles.actionsGrid}>
          {[
            { label: 'Register', icon: 'add-circle', desc: 'Add new item', bg: colors.pastel.sageLight, route: '/(tabs)/items', iconColor: colors.accent.green },
            { label: 'Scan QR', icon: 'camera', desc: 'Scan a code', bg: colors.pastel.lavenderLight, route: '/(tabs)/scanner', iconColor: colors.accent.purple },
            { label: 'Reports', icon: 'list-circle', desc: 'View found', bg: colors.pastel.peachLight, route: '/(tabs)/reports', iconColor: colors.accent.coral },
            { label: 'Profile', icon: 'person', desc: 'Settings', bg: colors.pastel.blueLight, route: '/(tabs)/profile', iconColor: colors.accent.blue },
          ].map((action) => (
            <TouchableOpacity
              key={action.label}
              style={[styles.actionCard, { backgroundColor: action.bg }]}
              onPress={() => router.push(action.route as any)}
              activeOpacity={0.7}
            >
              <Ionicons name={action.icon as any} size={28} color={action.iconColor} style={{ marginBottom: 6 }} />
              <Text style={styles.actionLabel}>{action.label}</Text>
              <Text style={styles.actionDesc}>{action.desc}</Text>
              <View style={styles.actionArrow}>
                <Ionicons name="arrow-forward" size={14} color={colors.text.primary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Progress Card */}
        {stats.total > 0 && (
          <View style={styles.progressCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing.lg }}>
                <Ionicons name="stats-chart" size={18} color={colors.primary} />
                <Text style={[fonts.subheading, { marginBottom: 0, marginTop: 0 }]}>Recovery Overview</Text>
            </View>
            <View style={styles.progressRow}>
              <View style={styles.progressCircle}>
                <Text style={styles.progressPercent}>{safePercent}%</Text>
                <Text style={styles.progressSubtext}>Protected</Text>
              </View>
              <View style={{ flex: 1, marginLeft: spacing.xl }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={[fonts.small, { fontWeight: '600' }]}>Items Status</Text>
                    <Text style={[fonts.caption, { color: colors.primary }]}>{stats.safe}/{stats.total}</Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${safePercent}%` }]} />
                </View>
                <View style={{ flexDirection: 'row', gap: 12, marginTop: spacing.md }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent.green }} />
                        <Text style={[fonts.caption, { fontWeight: '700', color: colors.text.secondary }]}>{stats.safe} Safe</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent.blue }} />
                        <Text style={[fonts.caption, { fontWeight: '700', color: colors.text.secondary }]}>{stats.found} Found</Text>
                    </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Notifications */}
        {notifications.length > 0 && (
          <TouchableOpacity 
            style={styles.notifBanner}
            onPress={() => router.push('/(tabs)/profile')}
            activeOpacity={0.8}
          >
            <View style={styles.notifIcon}>
              <Ionicons name="notifications" size={20} color={colors.accent.coral} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[fonts.regular, { fontWeight: '700' }]}>
                {notifications.length} unread notification{notifications.length > 1 ? 's' : ''}
              </Text>
              <Text style={[fonts.muted, { marginTop: 1 }]}>Tap to view details</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
          </TouchableOpacity>
        )}

        {/* Activity */}
        {(reports.length > 0 || notifications.length > 0) && (
          <View style={{ marginBottom: spacing.xl }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: spacing.xxl, marginBottom: spacing.md }}>
                <Ionicons name="time" size={20} color={colors.text.muted} />
                <Text style={[fonts.subheading, { marginTop: 0, marginBottom: 0 }]}>Activity</Text>
            </View>
            <View style={styles.card}>
              {[...reports.slice(0, 3).map((r: any) => ({
                id: r._id,
                icon: 'location',
                title: `${r.finderName} found an item`,
                sub: r.finderLocation,
                time: r.createdAt,
                bg: colors.pastel.blueLight,
                color: colors.accent.blue,
              })),
              ...notifications.slice(0, 2).map((n: any) => ({
                id: n._id,
                icon: 'notifications',
                title: n.title,
                sub: n.body,
                time: n.createdAt,
                bg: colors.pastel.lavenderLight,
                color: colors.accent.purple,
              }))]
              .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
              .slice(0, 4)
              .map((event, i, arr) => (
                <View key={event.id} style={[styles.timelineItem, i < arr.length - 1 && styles.timelineBorder]}>
                  <View style={[styles.timelineIcon, { backgroundColor: event.bg }]}>
                    <Ionicons name={event.icon as any} size={14} color={event.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[fonts.regular, { fontWeight: '700', fontSize: 13 }]}>{event.title}</Text>
                    <Text style={[fonts.muted, { marginTop: 2, fontSize: 11 }]} numberOfLines={1}>{event.sub}</Text>
                    <Text style={[styles.timelineTime]}>
                      {new Date(event.time).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  greeting: { ...fonts.heading },
  profileBtn: { padding: spacing.xs },
  sub: { ...fonts.small, color: colors.text.muted, marginTop: spacing.xs, maxWidth: '85%' },

  statusRow: { flexDirection: 'row', gap: spacing.sm, marginVertical: spacing.lg },
  statusChip: { flex: 1, flexDirection: 'column', alignItems: 'center', paddingHorizontal: spacing.sm, paddingVertical: spacing.md, borderRadius: radius.md, backgroundColor: colors.white, gap: 4, ...shadows.soft },
  statusChipActive: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.primary + '30' },
  statusLabel: { fontSize: 10, fontWeight: '700', color: colors.text.secondary },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  statCard: { width: '47.5%', borderRadius: radius.md, padding: spacing.xl, alignItems: 'center', ...shadows.card },
  statValue: { fontSize: 32, fontWeight: '900', color: colors.text.primary, marginTop: spacing.sm },
  statLabel: { fontSize: 11, fontWeight: '700', color: colors.text.secondary, marginTop: 4 },

  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  actionCard: { width: '47.5%', borderRadius: radius.md, padding: spacing.xl, ...shadows.soft },
  actionLabel: { fontWeight: '800', fontSize: 15, color: colors.text.primary },
  actionDesc: { fontSize: 11, color: colors.text.muted, marginTop: 4 },
  actionArrow: { position: 'absolute', top: spacing.xl, right: spacing.xl, width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.7)', justifyContent: 'center', alignItems: 'center' },

  progressCard: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.xxl, marginTop: spacing.md, ...shadows.card },
  progressRow: { flexDirection: 'row', alignItems: 'center' },
  progressCircle: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.pastel.lavenderLight, justifyContent: 'center', alignItems: 'center', ...shadows.soft },
  progressPercent: { fontSize: 24, fontWeight: '900', color: colors.text.primary },
  progressSubtext: { fontSize: 10, color: colors.text.muted, fontWeight: '700', marginTop: -2 },
  progressBar: { height: 8, backgroundColor: colors.cream[100], borderRadius: 100, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 100, backgroundColor: colors.primary },

  notifBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg + 2, marginTop: spacing.xl, gap: spacing.lg, ...shadows.soft, borderWidth: 1, borderColor: colors.pastel.peach },
  notifIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.pastel.peachLight, justifyContent: 'center', alignItems: 'center' },

  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.xl, ...shadows.soft },
  timelineItem: { flexDirection: 'row', gap: spacing.lg, paddingVertical: spacing.lg },
  timelineBorder: { borderBottomWidth: 1, borderBottomColor: colors.cream[100] },
  timelineIcon: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  timelineTime: { fontSize: 10, color: colors.text.muted, marginTop: 6, fontWeight: '500' },
});

