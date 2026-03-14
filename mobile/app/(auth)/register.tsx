import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { colors, spacing, radius, fonts, shadows } from '../../constants/theme';

export default function RegisterScreen() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      await register(form);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string) => (value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const fields = [
    { key: 'name', icon: '👤', placeholder: 'Full Name', props: {} },
    { key: 'email', icon: '📧', placeholder: 'Email', props: { keyboardType: 'email-address' as const, autoCapitalize: 'none' as const } },
    { key: 'password', icon: '🔒', placeholder: 'Password (6+ chars)', props: { secureTextEntry: true } },
    { key: 'phone', icon: '📱', placeholder: 'Phone (optional)', props: { keyboardType: 'phone-pad' as const } },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>QRetrieve</Text>

      <View style={styles.card}>
        <Text style={styles.heading}>Create account</Text>
        <Text style={styles.subtext}>Start protecting your belongings</Text>

        {fields.map((f) => (
          <View key={f.key} style={styles.inputRow}>
            <Text style={styles.inputIcon}>{f.icon}</Text>
            <TextInput
              style={styles.input}
              placeholder={f.placeholder}
              value={(form as any)[f.key]}
              onChangeText={update(f.key)}
              placeholderTextColor={colors.text.muted}
              {...f.props}
            />
          </View>
        ))}

        <TouchableOpacity style={[styles.button, loading && { opacity: 0.6 }]} onPress={handleRegister} disabled={loading} activeOpacity={0.7}>
          <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Create Account'}</Text>
        </TouchableOpacity>

        <Link href="/(auth)/login" style={styles.link}>
          <Text style={styles.linkText}>Already have an account? <Text style={{ color: colors.primary, fontWeight: '700' }}>Sign in</Text></Text>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: spacing.xxl, backgroundColor: colors.pastel.lavenderLight },
  title: { fontSize: 34, fontWeight: '800', textAlign: 'center', color: colors.primary, marginBottom: spacing.xxl },
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
