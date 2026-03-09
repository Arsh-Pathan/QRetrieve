import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { NotificationProvider } from '../hooks/useNotification';
import NotificationPopup from '../components/NotificationPopup';
import { colors } from '../constants/theme';

export default function RootLayout() {
  return (
    <NotificationProvider>
      <StatusBar style="dark" />
      <Tabs
        screenOptions={{
          headerStyle: {
            backgroundColor: 'rgba(255,255,255,0.92)',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: colors.cardBorder,
          },
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
            color: colors.primary,
          },
          tabBarStyle: {
            backgroundColor: 'rgba(255,255,255,0.95)',
            borderTopWidth: 1,
            borderTopColor: colors.cardBorder,
            paddingBottom: 4,
            height: 60,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarLabelStyle: {
            fontWeight: '600',
            fontSize: 11,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Register',
            headerTitle: 'QRetrieve',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add-circle-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="scanner"
          options={{
            title: 'Scan',
            headerTitle: 'Scan QR Code',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="scan-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Dashboard',
            headerTitle: 'Dashboard',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="grid-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="found/[itemId]"
          options={{
            href: null, // Hidden from tabs — navigated to via scan/deeplink
            title: 'Found Item',
            headerTitle: 'Report Found Item',
          }}
        />
      </Tabs>
      <NotificationPopup />
    </NotificationProvider>
  );
}
