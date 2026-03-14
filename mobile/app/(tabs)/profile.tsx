import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
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
          <View style={{ flex: 1 }}>
            <Text style={[fonts.subheading, { fontSize: 20 }]}>{user?.name}</Text>
            <Text style={fonts.muted}>{user?.email}</Text>
            {user?.phone && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <Ionicons name="call-outline" size={14} color={colors.text.muted} />
                <Text style={[fonts.muted, { fontSize: 13 }]}>{user.phone}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="create-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Items', value: stats.items, bg: colors.pastel.lavenderLight, icon: 'cube', color: colors.accent.purple },
            { label: 'Reports', value: stats.reports, bg: colors.pastel.peachLight, icon: 'notifications', color: colors.accent.coral },
            { label: 'Safe Rate', value: `${stats.safeRate}%`, bg: colors.pastel.sageLight, icon: 'shield-checkmark', color: colors.accent.green },
          ].map((stat) => (
            <View key={stat.label} style={[styles.statCard, { backgroundColor: stat.bg }]}>
              <Ionicons name={stat.icon as any} size={20} color={stat.color} style={{ marginBottom: 4 }} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={[fonts.caption, { color: colors.text.secondary }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Account info */}
        <View style={styles.card}>
          <Text style={[fonts.subheading, { marginBottom: spacing.md }]}>Account Details</Text>
          {[
            { icon: 'mail', label: 'Email Address', value: user?.email, color: colors.accent.blue },
            { icon: 'call', label: 'Phone Number', value: user?.phone || 'Not provided', color: colors.accent.green },
            { icon: 'calendar', label: 'Member Status', value: 'Active Member', color: colors.accent.purple },
            { icon: 'lock-closed', label: 'Security', value: 'Password Protected', color: colors.accent.coral },
          ].map((item, i, arr) => (
            <View key={item.label} style={[styles.infoRow, i < arr.length - 1 && styles.infoBorder]}>
              <View style={[styles.iconBox, { backgroundColor: item.color + '15' }]}>
                <Ionicons name={item.icon as any} size={18} color={item.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[fonts.caption, { color: colors.text.muted }]}>{item.label}</Text>
                <Text style={[fonts.regular, { fontWeight: '600', fontSize: 14, color: colors.text.primary }]}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.7}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="log-out-outline" size={20} color={colors.white} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={fonts.caption}>QRetrieve Pro v2.1.0</Text>
          <Text style={[fonts.caption, { marginTop: 4 }]}>Your data is encrypted and secure.</Text>
        </View>
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
    width: 60, height: 60, borderRadius: 30,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: colors.primary,
    ...shadows.soft,
  },
  avatarText: { color: colors.white, fontSize: 26, fontWeight: '800' },
  editBtn: { padding: spacing.sm, backgroundColor: colors.pastel.lavenderLight, borderRadius: radius.sm },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl },
  statCard: { flex: 1, borderRadius: radius.md, padding: spacing.lg, alignItems: 'center', ...shadows.soft },
  statValue: { fontSize: 20, fontWeight: '900', color: colors.text.primary },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.xxl, marginTop: spacing.xl, ...shadows.card },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, paddingVertical: spacing.lg },
  infoBorder: { borderBottomWidth: 1, borderBottomColor: colors.cream[100] },
  iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  logoutBtn: { backgroundColor: colors.danger, borderRadius: radius.sm, padding: spacing.lg, alignItems: 'center', marginTop: spacing.xxl, ...shadows.soft },
  logoutText: { color: colors.white, fontWeight: '700', fontSize: 16 },
  footer: { alignItems: 'center', marginTop: spacing.xxxl, opacity: 0.6 },
});
