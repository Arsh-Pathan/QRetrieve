import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { colors, spacing, radius, fonts } from '../../constants/theme';

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
      <Text style={styles.subtitle}>Never lose what matters</Text>

      <View style={styles.card}>
        <Text style={styles.heading}>Welcome back</Text>
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
        </TouchableOpacity>
        <Link href="/(auth)/register" style={styles.link}>
          <Text style={styles.linkText}>Don't have an account? <Text style={{ color: colors.primary }}>Sign up</Text></Text>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: spacing.xxl, backgroundColor: colors.bg },
  title: { ...fonts.heading, fontSize: 32, textAlign: 'center' },
  subtitle: { ...fonts.small, textAlign: 'center', marginBottom: spacing.xxxl },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.xxl, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 20, elevation: 3 },
  heading: { ...fonts.subheading, marginBottom: spacing.xl },
  input: { backgroundColor: colors.bg, borderRadius: radius.sm, padding: spacing.lg, marginBottom: spacing.md, fontSize: 15, borderWidth: 1, borderColor: colors.border },
  button: { backgroundColor: colors.primary, borderRadius: radius.sm, padding: spacing.lg, alignItems: 'center', marginTop: spacing.md },
  buttonText: { color: colors.white, fontWeight: '600', fontSize: 16 },
  link: { marginTop: spacing.xl, alignSelf: 'center' },
  linkText: { ...fonts.small, textAlign: 'center' },
});
