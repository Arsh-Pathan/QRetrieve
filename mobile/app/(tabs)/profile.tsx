import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { colors, spacing, radius, fonts, shadows } from '../../constants/theme';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ items: 0, reports: 0, safeRate: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [itemsRes, reportsRes] = await Promise.all([
          api.get<{ items: any[] }>('/items?limit=100'),
          api.get<{ reports: any[] }>('/reports'),
        ]);
        const items = itemsRes.items;
        const safe = items.filter((i: any) => i.status === 'safe').length;
        setStats({
          items: items.length,
          reports: reportsRes.reports?.length || 0,
          safeRate: items.length > 0 ? Math.round((safe / items.length) * 100) : 0,
        });
      } catch (err) { console.error(err); }
    };
    fetchStats();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={fonts.heading}>Profile</Text>

        {/* User card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase()}</Text>
          </View>
          <View>
            <Text style={[fonts.subheading, { fontSize: 20 }]}>{user?.name}</Text>
            <Text style={fonts.muted}>{user?.email}</Text>
            {user?.phone && (
              <Text style={[fonts.muted, { marginTop: 2 }]}>📱 {user.phone}</Text>
            )}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Items', value: stats.items, bg: colors.pastel.lavenderLight },
            { label: 'Reports', value: stats.reports, bg: colors.pastel.peachLight },
            { label: 'Safe Rate', value: `${stats.safeRate}%`, bg: colors.pastel.sageLight },
          ].map((stat) => (
            <View key={stat.label} style={[styles.statCard, { backgroundColor: stat.bg }]}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={fonts.caption}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Account info */}
        <View style={styles.card}>
          <Text style={[fonts.subheading, { marginBottom: spacing.md }]}>Account</Text>
          {[
            { icon: '📧', label: 'Email', value: user?.email },
            { icon: '📱', label: 'Phone', value: user?.phone || 'Not set' },
            { icon: '📅', label: 'Status', value: 'Active member' },
          ].map((item, i, arr) => (
            <View key={item.label} style={[styles.infoRow, i < arr.length - 1 && styles.infoBorder]}>
              <Text style={{ fontSize: 16 }}>{item.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={fonts.caption}>{item.label}</Text>
                <Text style={[fonts.regular, { fontWeight: '500', fontSize: 14 }]}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.7}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={[fonts.caption, { textAlign: 'center', marginTop: spacing.xxl }]}>
          QRetrieve v2.0 — Scan it. Find it. Return it.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: spacing.xxl, paddingBottom: spacing.xxxl * 2 },
  userCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.lg,
    backgroundColor: colors.white, borderRadius: radius.lg,
    padding: spacing.xxl, marginTop: spacing.xxl, ...shadows.card,
  },
  avatar: {
    width: 56, height: 56, borderRadius: radius.md,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: colors.primary,
  },
  avatarText: { color: colors.white, fontSize: 24, fontWeight: '800' },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl },
  statCard: { flex: 1, borderRadius: radius.md, padding: spacing.lg, alignItems: 'center', ...shadows.soft },
  statValue: { fontSize: 22, fontWeight: '800', color: colors.text.primary },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.xxl, marginTop: spacing.xl, ...shadows.card },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  infoBorder: { borderBottomWidth: 1, borderBottomColor: colors.cream[100] },
  logoutBtn: { backgroundColor: colors.danger, borderRadius: radius.sm, padding: spacing.lg, alignItems: 'center', marginTop: spacing.xxl },
  logoutText: { color: colors.white, fontWeight: '700', fontSize: 16 },
});
