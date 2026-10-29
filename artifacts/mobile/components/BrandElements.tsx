import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useApp } from '@/context/AppContext';
import type { IconName } from '@/data/restaurant-config';
import { t } from '@/lib/copy';
import { useColors } from '@/hooks/useColors';

export function BrandMark({
  icon,
  background,
  foreground,
  size = 44,
}: {
  icon: IconName;
  background: string;
  foreground: string;
  size?: number;
}) {
  return (
    <View
      style={[
        styles.brandMark,
        { width: size, height: size, borderRadius: size * 0.36, backgroundColor: background },
      ]}
      accessibilityElementsHidden
    >
      <MaterialCommunityIcons name={icon} size={size * 0.53} color={foreground} />
    </View>
  );
}

export function CartShortcut() {
  const colors = useColors();
  const router = useRouter();
  const { cartCount, language, restaurant } = useApp();
  return (
    <Pressable
      style={[
        styles.cartButton,
        { backgroundColor: restaurant.brand.pale },
      ]}
      onPress={() => router.push('/cart')}
      accessibilityRole="button"
      accessibilityLabel={t('cart', language)}
      testID="open-cart"
    >
      <MaterialCommunityIcons
        name="shopping-outline"
        size={21}
        color={restaurant.brand.primary}
      />
      {cartCount > 0 ? (
        <View style={[styles.cartBadge, { backgroundColor: restaurant.brand.accent }]}>
          <Text style={[styles.cartBadgeText, { color: colors.primaryForeground }]}>
            {cartCount > 9 ? '9+' : cartCount}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

export function SectionHeading({
  title,
  action,
  onAction,
  align = 'left',
}: {
  title: string;
  action?: string;
  onAction?: () => void;
  align?: 'left' | 'right';
}) {
  const colors = useColors();
  const { restaurant } = useApp();
  return (
    <View
      style={[
        styles.sectionHeading,
        { flexDirection: align === 'right' ? 'row-reverse' : 'row' },
      ]}
    >
      <Text style={[styles.sectionTitle, { color: colors.foreground, textAlign: align }]}>{title}</Text>
      {action ? (
        <Pressable onPress={onAction} accessibilityRole="button">
          <Text style={[styles.sectionAction, { color: restaurant.brand.primary }]}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function DemoDataNotice({ compact = false }: { compact?: boolean }) {
  const { language, restaurant } = useApp();
  return (
    <View
      style={[
        styles.notice,
        compact && styles.noticeCompact,
        { backgroundColor: restaurant.brand.pale },
      ]}
    >
      <MaterialCommunityIcons
        name="information-outline"
        size={17}
        color={restaurant.brand.primary}
      />
      <Text
        style={[
          styles.noticeText,
          { color: restaurant.brand.ink, textAlign: language === 'ar' ? 'right' : 'left' },
        ]}
      >
        {t('previewOnly', language)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  brandMark: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    position: 'absolute',
    top: -4,
    right: -3,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
  },
  sectionHeading: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    flex: 1,
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
  },
  sectionAction: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    marginHorizontal: 6,
  },
  notice: {
    minHeight: 40,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  noticeCompact: {
    minHeight: 32,
    paddingVertical: 6,
  },
  noticeText: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    lineHeight: 18,
  },
});
