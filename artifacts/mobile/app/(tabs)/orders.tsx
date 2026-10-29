import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { formatDate, formatJod } from '@/lib/format';
import { t } from '@/lib/copy';
import { useColors } from '@/hooks/useColors';

export default function OrdersScreen() {
  const colors = useColors();
  const router = useRouter();
  const { language, isRTL, restaurant, tenant } = useApp();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={{ alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
          <Text style={[styles.eyebrow, { color: restaurant.brand.primary }]}>{t('previewOnly', language)}</Text>
          <Text style={[styles.title, { color: colors.foreground, textAlign: isRTL ? 'right' : 'left' }]}>
            {t('orders', language)}
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.foreground, textAlign: isRTL ? 'right' : 'left' }]}>
          {t('orderHistory', language)}
        </Text>

        {tenant.orders.length ? (
          <View style={styles.list}>
            {tenant.orders.map((order) => (
              <Pressable
                key={order.id}
                onPress={() => router.push(`/order/${order.id}`)}
                accessibilityRole="button"
                testID={`order-${order.id}`}
                style={[
                  styles.orderCard,
                  { backgroundColor: colors.card, flexDirection: isRTL ? 'row-reverse' : 'row' },
                ]}
              >
                <View style={[styles.orderIcon, { backgroundColor: restaurant.brand.pale }]}>
                  <MaterialCommunityIcons
                    name={order.method === 'pickup' ? 'storefront-outline' : 'moped-outline'}
                    size={23}
                    color={restaurant.brand.primary}
                  />
                </View>
                <View style={[styles.orderCopy, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                  <Text style={[styles.orderNumber, { color: colors.foreground }]}>{order.number}</Text>
                  <Text style={[styles.orderMeta, { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'left' }]}>
                    {formatDate(order.createdAt, language)}
                  </Text>
                  <Text style={[styles.orderMeta, { color: restaurant.brand.primary }]}>
                    {t('statusReceived', language)}
                  </Text>
                </View>
                <View style={styles.orderEnd}>
                  <Text style={[styles.total, { color: colors.foreground }]}>
                    {formatJod(order.totalFils, language)}
                  </Text>
                  <MaterialCommunityIcons
                    name={isRTL ? 'chevron-left' : 'chevron-right'}
                    size={20}
                    color={colors.mutedForeground}
                  />
                </View>
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={[styles.empty, { backgroundColor: colors.card }]}>
            <View style={[styles.emptyIcon, { backgroundColor: restaurant.brand.pale }]}>
              <MaterialCommunityIcons name="receipt-text-outline" size={29} color={restaurant.brand.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>{t('noOrders', language)}</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground, textAlign: 'center' }]}>
              {t('noOrdersBody', language)}
            </Text>
          </View>
        )}
        <View style={[styles.note, { backgroundColor: restaurant.brand.pale }]}>
          <MaterialCommunityIcons name="information-outline" size={18} color={restaurant.brand.primary} />
          <Text style={[styles.noteText, { color: restaurant.brand.ink, textAlign: isRTL ? 'right' : 'left' }]}>
            {t('demoOrderNote', language)}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 20, paddingTop: 24, paddingBottom: 118, gap: 18 },
  eyebrow: { fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 0.7 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 27, marginTop: 4 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 18, marginTop: 4 },
  list: { gap: 10 },
  orderCard: { minHeight: 90, alignItems: 'center', gap: 11, padding: 13, borderRadius: 19 },
  orderIcon: { width: 47, height: 47, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  orderCopy: { flex: 1, gap: 3 },
  orderNumber: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  orderMeta: { fontFamily: 'Inter_400Regular', fontSize: 10 },
  orderEnd: { alignItems: 'flex-end', justifyContent: 'space-between', alignSelf: 'stretch' },
  total: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  empty: { minHeight: 250, borderRadius: 24, alignItems: 'center', justifyContent: 'center', padding: 25, gap: 9 },
  emptyIcon: { width: 58, height: 58, borderRadius: 21, alignItems: 'center', justifyContent: 'center', marginBottom: 3 },
  emptyTitle: { fontFamily: 'Inter_700Bold', fontSize: 17 },
  emptyText: { maxWidth: 270, fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 19 },
  note: { borderRadius: 15, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 9 },
  noteText: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 17 },
});
