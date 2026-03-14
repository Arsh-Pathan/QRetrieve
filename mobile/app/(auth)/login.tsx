import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { colors, spacing, radius, fonts, shadows } from '../../constants/theme';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>QRetrieve</Text>
      <Text style={styles.tagline}>Scan it. Find it. Return it.</Text>

      <View style={styles.card}>
        <Text style={styles.heading}>Welcome back</Text>
        <Text style={styles.subtext}>Sign in to manage your items</Text>

        <View style={styles.inputRow}>
          <Text style={styles.inputIcon}>📧</Text>
          <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor={colors.text.muted} />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputIcon}>🔒</Text>
          <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor={colors.text.muted} />
        </View>

        <TouchableOpacity style={[styles.button, loading && { opacity: 0.6 }]} onPress={handleLogin} disabled={loading} activeOpacity={0.7}>
          <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
        </TouchableOpacity>

        <Link href="/(auth)/register" style={styles.link}>
          <Text style={styles.linkText}>Don't have an account? <Text style={{ color: colors.primary, fontWeight: '700' }}>Sign up</Text></Text>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: spacing.xxl, backgroundColor: colors.pastel.lavenderLight },
  title: { fontSize: 34, fontWeight: '800', textAlign: 'center', color: colors.primary },
  tagline: { ...fonts.small, textAlign: 'center', marginBottom: spacing.xxxl, marginTop: spacing.xs },
  card: { backgroundColor: colors.white, borderRadius: radius.xl, padding: spacing.xxl * 1.2, ...shadows.elevated },
  heading: { ...fonts.subheading, fontSize: 22 },
  subtext: { ...fonts.muted, marginBottom: spacing.xl, marginTop: spacing.xs },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cream[50], borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md },
  inputIcon: { fontSize: 14, paddingLeft: spacing.lg },
  input: { flex: 1, padding: spacing.lg, fontSize: 15, color: colors.text.primary },
  button: { backgroundColor: colors.primary, borderRadius: radius.sm, padding: spacing.lg + 2, alignItems: 'center', marginTop: spacing.md },
  buttonText: { color: colors.white, fontWeight: '700', fontSize: 16 },
  link: { marginTop: spacing.xl, alignSelf: 'center' },
  linkText: { ...fonts.small, textAlign: 'center' },
});
