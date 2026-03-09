import React from 'react';
import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';
import { useNotification } from '../hooks/useNotification';
import { colors, spacing, radius, fonts } from '../constants/theme';

export default function NotificationPopup() {
  const { notification, dismissNotification } = useNotification();

  if (!notification) return null;

  return (
    <Modal transparent visible animationType="fade" onRequestClose={dismissNotification}>
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Pressable style={styles.closeBtn} onPress={dismissNotification}>
            <Text style={styles.closeTxt}>×</Text>
          </Pressable>

          <View style={styles.header}>
            <View style={styles.iconWrap}>
              <Text style={styles.icon}>
                {notification.type === 'found' ? '📍' : '✓'}
              </Text>
            </View>
            <Text style={styles.title}>
              {notification.title || 'Your item has been found!'}
            </Text>
          </View>

          {notification.data && (
            <View style={styles.details}>
              {notification.data.finderName && (
                <DetailRow label="Finder" value={notification.data.finderName} />
              )}
              {notification.data.finderLocation && (
                <DetailRow label="Location" value={notification.data.finderLocation} />
              )}
              {notification.data.message && (
                <DetailRow label="Message" value={notification.data.message} />
              )}
              {notification.data.finderContact && (
                <DetailRow label="Contact" value={notification.data.finderContact} />
              )}
            </View>
          )}

          {notification.message && (
            <Text style={styles.message}>{notification.message}</Text>
          )}

          <Pressable style={styles.btn} onPress={dismissNotification}>
            <Text style={styles.btnTxt}>Got it</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(26,26,46,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  popup: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.xxl,
    width: '100%',
    maxWidth: 400,
    elevation: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
  },
  closeBtn: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.lg,
    zIndex: 1,
  },
  closeTxt: { fontSize: 28, color: colors.textMuted, lineHeight: 28 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: { fontSize: 22 },
  title: { ...fonts.subheading, flex: 1 },
  details: {
    backgroundColor: colors.bgStart,
    borderRadius: radius.sm,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingVertical: spacing.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  rowLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  rowValue: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
    textAlign: 'right',
    maxWidth: '60%',
  },
  message: {
    ...fonts.small,
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
  },
  btnTxt: { color: colors.white, fontWeight: '600', fontSize: 15 },
});
