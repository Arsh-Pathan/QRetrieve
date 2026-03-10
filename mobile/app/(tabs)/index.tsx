import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { colors, spacing, radius, fonts } from '../../constants/theme';

export default function HomeScreen() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, safe: 0, found: 0 });
  const [notifications, setNotifications] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [items, notifs] = await Promise.all([
        api.get<{ items: any[] }>('/items?limit=100'),
        api.get<{ notifications: any[]; unreadCount: number }>('/notifications'),
      ]);
      const itemList = items.items;
      setStats({
        total: itemList.length,
        safe: itemList.filter((i: any) => i.status === 'safe').length,
        found: itemList.filter((i: any) => i.status === 'found').length,
      });
      setNotifications(notifs.notifications.filter((n: any) => !n.read).slice(0, 5));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <Text style={styles.greeting}>Hello, {user?.name}</Text>
        <Text style={styles.sub}>Welcome back to QRetrieve</Text>

        <View style={styles.statsRow}>
          {[
            { label: 'Safe', value: stats.safe, color: colors.accent.green },
            { label: 'Found', value: stats.found, color: colors.primary },
            { label: 'Total', value: stats.total, color: colors.accent.blue },
          ].map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {notifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Notifications</Text>
            {notifications.map((n: any) => (
              <View key={n._id} style={styles.notifCard}>
                <Text style={styles.notifTitle}>{n.title}</Text>
                <Text style={styles.notifBody}>{n.body}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: spacing.xxl },
  greeting: { ...fonts.heading },
  sub: { ...fonts.small, marginBottom: spacing.xxl },
  statsRow: { flexDirection: 'row', gap: spacing.md },
  statCard: { flex: 1, backgroundColor: colors.white, borderRadius: radius.md, padding: spacing.lg, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  statValue: { fontSize: 28, fontWeight: '700' },
  statLabel: { ...fonts.muted, marginTop: spacing.xs },
  section: { marginTop: spacing.xxl },
  sectionTitle: { ...fonts.subheading, marginBottom: spacing.md },
  notifCard: { backgroundColor: colors.white, borderRadius: radius.sm, padding: spacing.lg, marginBottom: spacing.sm },
  notifTitle: { ...fonts.regular, fontWeight: '600' },
  notifBody: { ...fonts.small, marginTop: spacing.xs },
});
