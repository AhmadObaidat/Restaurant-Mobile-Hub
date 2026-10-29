import React from 'react';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { formatDate, formatJod } from '@/lib/format';
import { t } from '@/lib/copy';
import { useColors } from '@/hooks/useColors';

export default function OrderDetailsScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { language, isRTL, restaurant, tenant } = useApp();
  const order = tenant.orders.find((item) => item.id === id);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backButton, { backgroundColor: colors.card }]}
          accessibilityRole="button"
          testID="order-detail-back"
        >
          <Feather name={isRTL ? 'arrow-right' : 'arrow-left'} size={19} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>{t('orderTracking', language)}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {order ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={[styles.receiptHero, { backgroundColor: restaurant.brand.primary }]}>
          <View style={[styles.receiptIcon, { backgroundColor: colors.card }]}>
              <MaterialCommunityIcons name="receipt-text-check-outline" size={28} color={restaurant.brand.primary} />
            </View>
            <Text style={[styles.receiptEyebrow, { color: colors.primaryForeground }]}>{t('demoReceipt', language)}</Text>
            <Text style={[styles.orderNumber, { color: colors.primaryForeground }]}>{order.number}</Text>
            <Text style={[styles.orderDate, { color: colors.primaryForeground }]}>{formatDate(order.createdAt, language)}</Text>
          </View>

          <View style={[styles.statusCard, { backgroundColor: colors.card }]}>
            <View style={[styles.statusHeading, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <MaterialCommunityIcons name="information-outline" size={20} color={restaurant.brand.primary} />
              <Text style={[styles.statusTitle, { color: colors.foreground }]}>{t('statusReceived', language)}</Text>
            </View>
            <Text style={[styles.statusNote, { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'left' }]}>
              {t('demoOrderNote', language)}
            </Text>
          </View>

          <View style={[styles.orderCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t('details', language)}</Text>
            <SummaryRow
              label={t('details', language)}
              value={t(order.method, language)}
              isRTL={isRTL}
            />
            {order.deliveryArea ? (
              <SummaryRow
                label={t('deliveryArea', language)}
                value={order.deliveryArea}
                isRTL={isRTL}
              />
            ) : null}
            {order.lines.map((line) => (
              <View key={line.id} style={[styles.line, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <View style={[styles.lineIcon, { backgroundColor: restaurant.brand.pale }]}>
                  <MaterialCommunityIcons name={line.icon} size={19} color={restaurant.brand.primary} />
                </View>
                <Text style={[styles.lineName, { color: colors.foreground, textAlign: isRTL ? 'right' : 'left' }]}>
                  {line.quantity} × {language === 'ar' ? line.nameAr : line.name}
                </Text>
                <Text style={[styles.lineTotal, { color: colors.foreground }]}>
                  {formatJod(line.priceFils * line.quantity, language)}
                </Text>
              </View>
            ))}
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <SummaryRow label={t('subtotal', language)} value={formatJod(order.subtotalFils, language)} isRTL={isRTL} />
            {order.deliveryFeeFils > 0 ? (
              <SummaryRow label={t('deliveryFee', language)} value={formatJod(order.deliveryFeeFils, language)} isRTL={isRTL} />
            ) : null}
            <SummaryRow
              label={t('total', language)}
              value={formatJod(order.totalFils, language)}
              isRTL={isRTL}
              strong
              color={restaurant.brand.primary}
            />
          </View>
        </ScrollView>
      ) : (
        <View style={styles.notFound}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t('noOrders', language)}</Text>
          <Pressable onPress={() => router.replace('/(tabs)/orders')} style={[styles.backAction, { backgroundColor: restaurant.brand.primary }]}>
            <Text style={[styles.backActionText, { color: colors.primaryForeground }]}>{t('orders', language)}</Text>
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
      <Text style={[styles.summaryLabel, { color: strong ? colors.foreground : colors.mutedForeground, fontFamily: strong ? 'Inter_700Bold' : 'Inter_400Regular' }]}>{label}</Text>
      <Text style={[styles.summaryValue, { color: color ?? colors.foreground, fontFamily: strong ? 'Inter_700Bold' : 'Inter_500Medium' }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { minHeight: 58, alignItems: 'center', paddingHorizontal: 20, gap: 12 },
  backButton: { width: 42, height: 42, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontFamily: 'Inter_700Bold', fontSize: 16 },
  headerSpacer: { width: 42 },
  content: { padding: 20, paddingBottom: 40, gap: 14 },
  receiptHero: { minHeight: 186, borderRadius: 24, alignItems: 'center', justifyContent: 'center', padding: 19, gap: 5 },
  receiptIcon: { width: 51, height: 51, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  receiptEyebrow: { opacity: 0.76, fontFamily: 'Inter_600SemiBold', fontSize: 10 },
  orderNumber: { fontFamily: 'Inter_700Bold', fontSize: 23 },
  orderDate: { opacity: 0.85, fontFamily: 'Inter_400Regular', fontSize: 11 },
  statusCard: { borderRadius: 18, padding: 14, gap: 8 },
  statusHeading: { alignItems: 'center', gap: 8 },
  statusTitle: { flex: 1, fontFamily: 'Inter_700Bold', fontSize: 13 },
  statusNote: { fontFamily: 'Inter_400Regular', fontSize: 10, lineHeight: 16 },
  orderCard: { borderRadius: 19, padding: 15, gap: 12 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  line: { alignItems: 'center', gap: 9 },
  lineIcon: { width: 37, height: 37, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  lineName: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 11 },
  lineTotal: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
  divider: { height: 1 },
  summaryRow: { alignItems: 'center', justifyContent: 'space-between' },
  summaryLabel: { fontSize: 12 },
  summaryValue: { fontSize: 12 },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 },
  backAction: { borderRadius: 15, paddingHorizontal: 18, paddingVertical: 12 },
  backActionText: { fontFamily: 'Inter_700Bold', fontSize: 13 },
});
