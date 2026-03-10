import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../services/api';
import { colors, spacing, fonts } from '../../constants/theme';
import { ReportCard } from '../../components/ReportCard';

export default function ReportsScreen() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    try {
      const res = await api.get<{ reports: any[] }>('/reports');
      setReports(res.reports);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={fonts.heading}>Found Reports</Text>
      </View>
      <FlatList
        data={reports}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <ReportCard report={item} />}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={fetchReports}
        ListEmptyComponent={<Text style={[fonts.muted, { textAlign: 'center', marginTop: 40 }]}>No reports yet</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { padding: spacing.xxl, paddingBottom: spacing.md },
  list: { padding: spacing.xxl, paddingTop: 0, gap: spacing.md },
});
