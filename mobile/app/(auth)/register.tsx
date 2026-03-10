import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { colors, spacing, radius, fonts } from '../../constants/theme';

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>QRetrieve</Text>
      <View style={styles.card}>
        <Text style={styles.heading}>Create account</Text>
        <TextInput style={styles.input} placeholder="Full Name" value={form.name} onChangeText={update('name')} />
        <TextInput style={styles.input} placeholder="Email" value={form.email} onChangeText={update('email')} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Password" value={form.password} onChangeText={update('password')} secureTextEntry />
        <TextInput style={styles.input} placeholder="Phone (optional)" value={form.phone} onChangeText={update('phone')} keyboardType="phone-pad" />
        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Create Account'}</Text>
        </TouchableOpacity>
        <Link href="/(auth)/login" style={styles.link}>
          <Text style={styles.linkText}>Already have an account? <Text style={{ color: colors.primary }}>Sign in</Text></Text>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: spacing.xxl, backgroundColor: colors.bg },
  title: { ...fonts.heading, fontSize: 32, textAlign: 'center', marginBottom: spacing.xxl },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.xxl, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 20, elevation: 3 },
  heading: { ...fonts.subheading, marginBottom: spacing.xl },
  input: { backgroundColor: colors.bg, borderRadius: radius.sm, padding: spacing.lg, marginBottom: spacing.md, fontSize: 15, borderWidth: 1, borderColor: colors.border },
  button: { backgroundColor: colors.primary, borderRadius: radius.sm, padding: spacing.lg, alignItems: 'center', marginTop: spacing.md },
  buttonText: { color: colors.white, fontWeight: '600', fontSize: 16 },
  link: { marginTop: spacing.xl, alignSelf: 'center' },
  linkText: { ...fonts.small, textAlign: 'center' },
});
