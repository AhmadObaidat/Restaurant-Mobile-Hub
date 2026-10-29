import React from 'react';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { Platform, StyleSheet, useColorScheme, View } from 'react-native';
import { Tabs } from 'expo-router';
import { NativeTabs } from 'expo-router/native-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';
import { t } from '@/lib/copy';

function ClassicTabLayout() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const { language, restaurant } = useApp();
  const isDark = colorScheme === 'dark';
  const isIOS = Platform.OS === 'ios';
  const isWeb = Platform.OS === 'web';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: restaurant.brand.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: isIOS ? 'transparent' : colors.background,
          borderTopWidth: isWeb ? 1 : 0,
          borderTopColor: colors.border,
          elevation: 0,
          paddingBottom: isWeb ? 0 : insets.bottom,
          ...(isWeb ? { height: 84 } : {}),
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={100}
              tint={isDark ? 'dark' : 'light'}
              style={StyleSheet.absoluteFill}
            />
          ) : isWeb ? (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]} />
          ) : null,
      }}
    >
      <Tabs.Screen name="index" options={{ title: t('home', language), tabBarIcon: ({ color }) => <Feather name="home" size={20} color={String(color)} /> }} />
      <Tabs.Screen name="menu" options={{ title: t('menu', language), tabBarIcon: ({ color }) => <Feather name="grid" size={20} color={String(color)} /> }} />
      <Tabs.Screen name="rewards" options={{ title: t('rewards', language), tabBarIcon: ({ color }) => <Feather name="gift" size={20} color={String(color)} /> }} />
      <Tabs.Screen name="orders" options={{ title: t('orders', language), tabBarIcon: ({ color }) => <Feather name="file-text" size={20} color={String(color)} /> }} />
      <Tabs.Screen name="profile" options={{ title: t('profile', language), tabBarIcon: ({ color }) => <Feather name="user" size={20} color={String(color)} /> }} />
    </Tabs>
  );
}

function NativeTabLayout() {
  const { language } = useApp();
  const tabs = [
    { name: 'index', label: t('home', language), icon: 'house', selectedIcon: 'house.fill' },
    { name: 'menu', label: t('menu', language), icon: 'fork.knife', selectedIcon: 'fork.knife' },
    { name: 'rewards', label: t('rewards', language), icon: 'gift', selectedIcon: 'gift.fill' },
    { name: 'orders', label: t('orders', language), icon: 'receipt', selectedIcon: 'receipt.fill' },
    { name: 'profile', label: t('profile', language), icon: 'person', selectedIcon: 'person.fill' },
  ] as const;

  return (
    <NativeTabs>
      {tabs.map((tab) => (
        <NativeTabs.Trigger key={tab.name} name={tab.name}>
          <NativeTabs.Trigger.Icon sf={{ default: tab.icon, selected: tab.selectedIcon }} />
          <NativeTabs.Trigger.Label>{tab.label}</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      ))}
    </NativeTabs>
  );
}

export default function TabLayout() {
  return isLiquidGlassAvailable() ? <NativeTabLayout /> : <ClassicTabLayout />;
}
