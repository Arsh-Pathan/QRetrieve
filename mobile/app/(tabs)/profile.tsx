import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { colors, spacing, radius, fonts } from '../../constants/theme';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={fonts.heading}>Profile</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={fonts.label}>Name</Text>
            <Text style={fonts.regular}>{user?.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={fonts.label}>Email</Text>
            <Text style={fonts.regular}>{user?.email}</Text>
          </View>
          {user?.phone && (
            <View style={styles.row}>
              <Text style={fonts.label}>Phone</Text>
              <Text style={fonts.regular}>{user.phone}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: spacing.xxl },
  card: { backgroundColor: colors.white, borderRadius: radius.md, padding: spacing.xxl, marginTop: spacing.xxl, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  row: { marginBottom: spacing.lg },
  logoutBtn: { backgroundColor: colors.danger, borderRadius: radius.sm, padding: spacing.lg, alignItems: 'center', marginTop: spacing.xxl },
  logoutText: { color: colors.white, fontWeight: '600', fontSize: 16 },
});
