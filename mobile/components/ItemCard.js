import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import QRGeneratorWidget from './QRGeneratorWidget';
import { colors, spacing, radius, fonts } from '../constants/theme';

export default function ItemCard({ item }) {
  const [showQR, setShowQR] = useState(false);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.name}>{item.itemName}</Text>
          <Text style={styles.id}>ID: {item.itemId}</Text>
        </View>
        <View style={[styles.badge, item.status === 'found' ? styles.badgeFound : styles.badgeSafe]}>
          <Text style={[styles.badgeTxt, item.status === 'found' ? styles.badgeFoundTxt : styles.badgeSafeTxt]}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <DetailRow label="Owner" value={item.ownerName} />
        <DetailRow label="Contact" value={item.ownerContact} />
        <DetailRow label="Registered" value={formatDate(item.createdAt)} />
      </View>

      <Pressable style={styles.toggleBtn} onPress={() => setShowQR(!showQR)}>
        <Text style={styles.toggleTxt}>
          {showQR ? 'Hide QR Code' : 'View QR Code'}
        </Text>
      </Pressable>

      {showQR && (
        <View style={styles.qrSection}>
          <QRGeneratorWidget itemId={item.itemId} itemName={item.itemName} />
        </View>
      )}
    </View>
  );
}

function DetailRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  headerLeft: { flex: 1 },
  name: { ...fonts.subheading },
  id: { ...fonts.muted, fontFamily: 'monospace', marginTop: 2 },
  badge: { borderRadius: radius.full, paddingHorizontal: 12, paddingVertical: 4 },
  badgeSafe: { backgroundColor: 'rgba(46,204,113,0.12)' },
  badgeFound: { backgroundColor: 'rgba(108,99,255,0.12)' },
  badgeTxt: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  badgeSafeTxt: { color: colors.success },
  badgeFoundTxt: { color: colors.primary },
  details: { marginBottom: spacing.lg },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs + 2,
  },
  rowLabel: { ...fonts.label },
  rowValue: { ...fonts.regular, fontSize: 14 },
  toggleBtn: {
    borderWidth: 2,
    borderColor: colors.cardBorder,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    alignSelf: 'flex-start',
  },
  toggleTxt: { color: colors.primary, fontWeight: '600', fontSize: 13 },
  qrSection: { marginTop: spacing.lg },
});
