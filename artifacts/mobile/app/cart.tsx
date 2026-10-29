import React from 'react';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { formatJod } from '@/lib/format';
import { t } from '@/lib/copy';
import { useColors } from '@/hooks/useColors';

export default function CartScreen() {
  const colors = useColors();
  const router = useRouter();
  const { language, isRTL, restaurant, tenant, updateCartQuantity, removeFromCart } = useApp();
  const subtotal = tenant.cart.reduce((sum, line) => sum + line.priceFils * line.quantity, 0);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.iconButton, { backgroundColor: colors.card }]}
          accessibilityRole="button"
          accessibilityLabel={t('continueBrowsing', language)}
          testID="cart-back"
        >
          <Feather name={isRTL ? 'arrow-right' : 'arrow-left'} size={19} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>{t('cart', language)}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {tenant.cart.length ? (
        <>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            <View style={styles.lines}>
              {tenant.cart.map((line) => (
                <View
                  key={line.id}
                  style={[
                    styles.line,
                    { backgroundColor: colors.card, flexDirection: isRTL ? 'row-reverse' : 'row' },
                  ]}
                >
                  <View style={[styles.lineIcon, { backgroundColor: restaurant.brand.pale }]}>
                    <MaterialCommunityIcons name={line.icon} size={23} color={restaurant.brand.primary} />
                  </View>
                  <View style={[styles.lineCopy, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                    <Text style={[styles.lineName, { color: colors.foreground, textAlign: isRTL ? 'right' : 'left' }]}>
                      {language === 'ar' ? line.nameAr : line.name}
                    </Text>
                    {line.variantName ? (
                      <Text style={[styles.lineMeta, { color: colors.mutedForeground }]}>
                        {language === 'ar' ? line.variantNameAr : line.variantName}
                      </Text>
                    ) : null}
                    <Text style={[styles.linePrice, { color: restaurant.brand.primary }]}>
                      {formatJod(line.priceFils * line.quantity, language)}
                    </Text>
                    <Pressable
                      onPress={() => removeFromCart(line.id)}
                      accessibilityRole="button"
                      testID={`remove-${line.id}`}
                      style={styles.removeButton}
                    >
                      <Text style={[styles.removeText, { color: colors.mutedForeground }]}>{t('remove', language)}</Text>
                    </Pressable>
                  </View>
                  <View style={[styles.quantityControl, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <Pressable
                      onPress={() => updateCartQuantity(line.id, line.quantity - 1)}
                      accessibilityRole="button"
                      accessibilityLabel={`${t('quantity', language)} -`}
                      testID={`decrease-${line.id}`}
                      style={[styles.quantityButton, { backgroundColor: restaurant.brand.pale }]}
                    >
                      <Feather name="minus" size={14} color={restaurant.brand.primary} />
                    </Pressable>
                    <Text style={[styles.quantityText, { color: colors.foreground }]}>{line.quantity}</Text>
                    <Pressable
                      onPress={() => updateCartQuantity(line.id, line.quantity + 1)}
                      accessibilityRole="button"
                      accessibilityLabel={`${t('quantity', language)} +`}
                      testID={`increase-${line.id}`}
                      style={[styles.quantityButton, { backgroundColor: restaurant.brand.pale }]}
                    >
                      <Feather name="plus" size={14} color={restaurant.brand.primary} />
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>

            <View style={[styles.summary, { backgroundColor: colors.card }]}>
              <SummaryRow label={t('subtotal', language)} value={formatJod(subtotal, language)} isRTL={isRTL} />
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <SummaryRow
                label={t('total', language)}
                value={formatJod(subtotal, language)}
                isRTL={isRTL}
                strong
                color={restaurant.brand.primary}
              />
            </View>
            <View style={[styles.note, { backgroundColor: restaurant.brand.pale }]}>
              <MaterialCommunityIcons name="information-outline" size={18} color={restaurant.brand.primary} />
              <Text style={[styles.noteText, { color: restaurant.brand.ink, textAlign: isRTL ? 'right' : 'left' }]}>
                {t('demoOrderNote', language)}
              </Text>
            </View>
          </ScrollView>

          <View style={[styles.footer, { backgroundColor: colors.background }]}>
            <Pressable
              onPress={() => router.push('/checkout')}
              style={[styles.checkoutButton, { backgroundColor: restaurant.brand.primary }]}
              accessibilityRole="button"
              testID="go-to-checkout"
            >
              <Text style={[styles.checkoutText, { color: colors.primaryForeground }]}>{t('checkout', language)}</Text>
              <Feather name={isRTL ? 'arrow-left' : 'arrow-right'} size={17} color={colors.primaryForeground} />
            </Pressable>
          </View>
        </>
      ) : (
        <View style={styles.emptyWrap}>
          <View style={[styles.emptyIcon, { backgroundColor: restaurant.brand.pale }]}>
            <MaterialCommunityIcons name="shopping-outline" size={35} color={restaurant.brand.primary} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>{t('emptyCart', language)}</Text>
          <Text style={[styles.emptyBody, { color: colors.mutedForeground, textAlign: 'center' }]}>
            {t('emptyCartBody', language)}
          </Text>
          <Pressable
            onPress={() => router.push('/(tabs)/menu')}
            style={[styles.checkoutButton, { backgroundColor: restaurant.brand.primary }]}
            accessibilityRole="button"
            testID="empty-cart-menu"
          >
            <Text style={[styles.checkoutText, { color: colors.primaryForeground }]}>{t('continueBrowsing', language)}</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

function SummaryRow({
  label,
  value,
  isRTL,
  strong = false,
  color,
}: {
  label: string;
  value: string;
  isRTL: boolean;
  strong?: boolean;
  color?: string;
}) {
  const colors = useColors();
  return (
    <View style={[styles.summaryRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
      <Text style={[styles.summaryLabel, { color: strong ? colors.foreground : colors.mutedForeground, fontFamily: strong ? 'Inter_700Bold' : 'Inter_400Regular' }]}>
        {label}
      </Text>
      <Text style={[styles.summaryValue, { color: color ?? colors.foreground, fontFamily: strong ? 'Inter_700Bold' : 'Inter_500Medium' }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { minHeight: 58, alignItems: 'center', paddingHorizontal: 20, gap: 12 },
  iconButton: { width: 42, height: 42, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontFamily: 'Inter_700Bold', fontSize: 17 },
  headerSpacer: { width: 42 },
  content: { padding: 20, paddingBottom: 24, gap: 14 },
  lines: { gap: 10 },
  line: { minHeight: 132, borderRadius: 21, padding: 13, alignItems: 'flex-start', gap: 10 },
  lineIcon: { width: 45, height: 48, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  lineCopy: { flex: 1, gap: 4 },
  lineName: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  lineMeta: { fontFamily: 'Inter_400Regular', fontSize: 11 },
  linePrice: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  removeButton: { paddingTop: 2 },
  removeText: { fontFamily: 'Inter_500Medium', fontSize: 10 },
  quantityControl: { alignItems: 'center', gap: 7 },
  quantityButton: { width: 27, height: 27, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  quantityText: { minWidth: 15, textAlign: 'center', fontFamily: 'Inter_700Bold', fontSize: 12 },
  summary: { borderRadius: 20, padding: 15, gap: 13 },
  summaryRow: { justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 13 },
  summaryValue: { fontSize: 13 },
  divider: { height: 1 },
  note: { borderRadius: 15, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 9 },
  noteText: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 17 },
  footer: { paddingHorizontal: 20, paddingVertical: 12 },
  checkoutButton: { minHeight: 53, borderRadius: 18, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  checkoutText: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30, gap: 12 },
  emptyIcon: { width: 72, height: 72, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  emptyTitle: { fontFamily: 'Inter_700Bold', fontSize: 17 },
  emptyBody: { maxWidth: 260, fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 19 },
});
