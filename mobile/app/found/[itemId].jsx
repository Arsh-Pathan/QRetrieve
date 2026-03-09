import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getItemByItemId, submitReport } from '../../services/api';
import FoundReportForm from '../../components/FoundReportForm';
import Card from '../../components/Card';
import { colors, spacing, radius, fonts } from '../../constants/theme';

export default function FoundScreen() {
  const { itemId } = useLocalSearchParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await getItemByItemId(itemId);
        setItem(data);
      } catch (err) {
        setError('This item was not found in our system.');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [itemId]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await submitReport(formData);
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingTxt}>Looking up item...</Text>
      </View>
    );
  }

  if (error && !item) {
    return (
      <View style={styles.center}>
        <Card style={styles.errorCard}>
          <Text style={styles.errorTitle}>Item Not Found</Text>
          <Text style={styles.errorMsg}>{error}</Text>
        </Card>
      </View>
    );
  }

  if (submitted) {
    return (
      <View style={styles.center}>
        <Card style={styles.thankYouCard}>
          <View style={styles.thankYouIcon}>
            <Text style={styles.thankYouCheck}>✓</Text>
          </View>
          <Text style={styles.thankYouTitle}>Thank You!</Text>
          <Text style={styles.thankYouMsg}>
            Your report has been submitted. The owner of{' '}
            <Text style={styles.bold}>{item.itemName}</Text> has been notified
            and will reach out to you soon.
          </Text>
        </Card>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.scroll}
      keyboardShouldPersistTaps="handled"
    >
      <Card>
        <FoundReportForm
          itemId={itemId}
          itemName={item.itemName}
          onSubmit={handleSubmit}
          isSubmitting={submitting}
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bgStart },
  scroll: { padding: spacing.xl, paddingBottom: 40 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.bgStart,
  },
  loadingTxt: { ...fonts.muted, marginTop: spacing.md },
  errorCard: { alignItems: 'center', padding: spacing.xxxl },
  errorTitle: { fontSize: 20, fontWeight: '700', color: colors.danger, marginBottom: spacing.sm },
  errorMsg: { ...fonts.small, textAlign: 'center' },
  thankYouCard: { alignItems: 'center', padding: spacing.xxxl, width: '100%' },
  thankYouIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    elevation: 6,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  thankYouCheck: { color: colors.white, fontSize: 30, fontWeight: '800' },
  thankYouTitle: { fontSize: 22, fontWeight: '700', marginBottom: spacing.md },
  thankYouMsg: {
    ...fonts.small,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  bold: { fontWeight: '700', color: colors.textPrimary },
});
