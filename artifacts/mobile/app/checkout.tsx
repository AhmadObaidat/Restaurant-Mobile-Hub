import React, { useState } from 'react';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { formatJod } from '@/lib/format';
import { t } from '@/lib/copy';
import { useColors } from '@/hooks/useColors';

type FulfillmentMethod = 'pickup' | 'delivery';

export default function CheckoutScreen() {
  const colors = useColors();
  const router = useRouter();
  const { language, isRTL, restaurant, tenant, placeDemoOrder } = useApp();
  const [method, setMethod] = useState<FulfillmentMethod>('pickup');
  const subtotal = tenant.cart.reduce((sum, line) => sum + line.priceFils * line.quantity, 0);
  const fee = method === 'delivery' ? restaurant.deliveryFeeFils : 0;
  const minimumMet = subtotal >= restaurant.minimumOrderFils;

  const submit = async () => {
    if (!minimumMet) {
      Alert.alert(t('checkout', language), t('minimumOrder', language));
      return;
    }
    const order = placeDemoOrder(
      method,
      method === 'delivery'
        ? language === 'ar'
          ? restaurant.neighborhoodAr
          : restaurant.neighborhood
        : undefined,
    );
    if (!order) {
      Alert.alert(t('checkout', language), t('minimumOrder', language));
      return;
    }
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace({ pathname: '/order/[id]', params: { id: order.id } });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.iconButton, { backgroundColor: colors.card }]}
          accessibilityRole="button"
          accessibilityLabel={t('cart', language)}
          testID="checkout-back"
        >
          <Feather name={isRTL ? 'arrow-right' : 'arrow-left'} size={19} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>{t('checkout', language)}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, { color: colors.foreground, textAlign: isRTL ? 'right' : 'left' }]}>
          {t('chooseMethod', language)}
        </Text>
        <View style={[styles.methodRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <MethodCard
            title={t('pickup', language)}
            description={t('pickupNote', language)}
            icon="storefront-outline"
            selected={method === 'pickup'}
            onPress={() => setMethod('pickup')}
            testID="method-pickup"
          />
          {restaurant.deliveryEnabled ? (
            <MethodCard
              title={t('delivery', language)}
              description={t('chooseDeliveryArea', language)}
              icon="moped-outline"
              selected={method === 'delivery'}
              onPress={() => setMethod('delivery')}
              testID="method-delivery"
            />
          ) : null}
        </View>

        {method === 'delivery' ? (
          <View style={[styles.areaCard, { backgroundColor: colors.card, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <MaterialCommunityIcons name="map-marker-outline" size={22} color={restaurant.brand.primary} />
            <View style={styles.areaCopy}>
              <Text style={[styles.areaTitle, { color: colors.foreground }]}>{t('chooseDeliveryArea', language)}</Text>
              <Text style={[styles.areaText, { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'left' }]}>
                {language === 'ar' ? restaurant.neighborhoodAr : restaurant.neighborhood}
              </Text>
              <Text style={[styles.areaText, { color: restaurant.brand.primary, textAlign: isRTL ? 'right' : 'left' }]}>
                {t('deliveryArea', language)}
              </Text>
            </View>
            <MaterialCommunityIcons name="check-circle" size={19} color={restaurant.brand.primary} />
          </View>
        ) : null}

        <View style={[styles.paymentCard, { backgroundColor: restaurant.brand.pale }]}>
          <View style={[styles.paymentHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <MaterialCommunityIcons name="credit-card-outline" size={21} color={restaurant.brand.primary} />
            <Text style={[styles.paymentTitle, { color: restaurant.brand.ink }]}>{t('payment', language)}</Text>
            <Text style={[styles.demoBadge, { backgroundColor: colors.background, color: restaurant.brand.primary }]}>
              {t('previewOnly', language)}
            </Text>
          </View>
          <Text style={[styles.paymentMethod, { color: restaurant.brand.ink, textAlign: isRTL ? 'right' : 'left' }]}>
            {t('demoPayment', language)}
          </Text>
          <Text style={[styles.paymentNote, { color: restaurant.brand.ink, textAlign: isRTL ? 'right' : 'left' }]}>
            {t('demoPaymentNote', language)}
          </Text>
        </View>

        <View style={[styles.summary, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t('demoReceipt', language)}</Text>
          {tenant.cart.map((line) => (
            <View key={line.id} style={[styles.summaryRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={[styles.summaryLabel, { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'left' }]}>
                {line.quantity} × {language === 'ar' ? line.nameAr : line.name}
              </Text>
              <Text style={[styles.summaryValue, { color: colors.foreground }]}>
                {formatJod(line.priceFils * line.quantity, language)}
              </Text>
            </View>
          ))}
          <View style={[styles.summaryRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>{t('subtotal', language)}</Text>
            <Text style={[styles.summaryValue, { color: colors.foreground }]}>{formatJod(subtotal, language)}</Text>
          </View>
          {method === 'delivery' ? (
            <View style={[styles.summaryRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>{t('deliveryFee', language)}</Text>
              <Text style={[styles.summaryValue, { color: colors.foreground }]}>{formatJod(fee, language)}</Text>
            </View>
          ) : null}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={[styles.summaryRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={[styles.totalLabel, { color: colors.foreground }]}>{t('total', language)}</Text>
            <Text style={[styles.totalValue, { color: restaurant.brand.primary }]}>{formatJod(subtotal + fee, language)}</Text>
          </View>
        </View>
        {!minimumMet ? (
          <Text style={[styles.minimumWarning, { color: colors.destructive, textAlign: isRTL ? 'right' : 'left' }]}>
            {t('minimumOrder', language)}
          </Text>
        ) : null}
        <View style={[styles.disclaimer, { borderColor: restaurant.brand.accent }]}>
          <MaterialCommunityIcons name="information-outline" size={18} color={restaurant.brand.primary} />
          <Text style={[styles.disclaimerText, { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'left' }]}>
            {t('demoOrderNote', language)}
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <Pressable
          onPress={() => void submit()}
          disabled={!tenant.cart.length}
          accessibilityRole="button"
          testID="place-demo-order"
          style={[
            styles.placeButton,
            { backgroundColor: tenant.cart.length ? restaurant.brand.primary : colors.muted },
          ]}
        >
          <Text style={[styles.placeText, { color: tenant.cart.length ? colors.primaryForeground : colors.mutedForeground }]}>
            {t('placeDemoOrder', language)}
          </Text>
          <Feather name={isRTL ? 'arrow-left' : 'arrow-right'} size={17} color={tenant.cart.length ? colors.primaryForeground : colors.mutedForeground} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function MethodCard({
  title,
  description,
  icon,
  selected,
  onPress,
  testID,
}: {
  title: string;
  description: string;
  icon: 'storefront-outline' | 'moped-outline';
  selected: boolean;
  onPress: () => void;
  testID: string;
}) {
  const colors = useColors();
  const { isRTL, restaurant } = useApp();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      testID={testID}
      style={[
        styles.methodCard,
        {
          borderColor: selected ? restaurant.brand.primary : colors.border,
          backgroundColor: selected ? restaurant.brand.pale : colors.card,
        },
      ]}
    >
      <View style={[styles.methodIcon, { backgroundColor: colors.background }]}>
        <MaterialCommunityIcons name={icon} size={22} color={restaurant.brand.primary} />
      </View>
      <Text style={[styles.methodTitle, { color: colors.foreground, textAlign: isRTL ? 'right' : 'left' }]}>{title}</Text>
      <Text style={[styles.methodDescription, { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'left' }]}>{description}</Text>
      {selected ? <MaterialCommunityIcons name="check-circle" size={18} color={restaurant.brand.primary} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { minHeight: 58, alignItems: 'center', paddingHorizontal: 20, gap: 12 },
  iconButton: { width: 42, height: 42, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontFamily: 'Inter_700Bold', fontSize: 16 },
  headerSpacer: { width: 42 },
  content: { padding: 20, paddingBottom: 24, gap: 15 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  methodRow: { gap: 9 },
  methodCard: { flex: 1, minHeight: 145, borderWidth: 1, borderRadius: 20, padding: 12, gap: 7 },
  methodIcon: { width: 39, height: 39, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  methodTitle: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  methodDescription: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 10, lineHeight: 15 },
  areaCard: { minHeight: 73, borderRadius: 17, padding: 13, alignItems: 'center', gap: 9 },
  areaCopy: { flex: 1, gap: 3 },
  areaTitle: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  areaText: { fontFamily: 'Inter_400Regular', fontSize: 10 },
  paymentCard: { borderRadius: 19, padding: 15, gap: 7 },
  paymentHeader: { alignItems: 'center', gap: 8 },
  paymentTitle: { flex: 1, fontFamily: 'Inter_700Bold', fontSize: 14 },
  demoBadge: { borderRadius: 10, paddingHorizontal: 7, paddingVertical: 4, fontFamily: 'Inter_600SemiBold', fontSize: 9 },
  paymentMethod: { fontFamily: 'Inter_600SemiBold', fontSize: 12, marginTop: 4 },
  paymentNote: { fontFamily: 'Inter_400Regular', fontSize: 10, lineHeight: 16 },
  summary: { borderRadius: 19, padding: 15, gap: 11 },
  summaryRow: { alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  summaryLabel: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 11 },
  summaryValue: { fontFamily: 'Inter_500Medium', fontSize: 11 },
  divider: { height: 1, marginVertical: 2 },
  totalLabel: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  totalValue: { fontFamily: 'Inter_700Bold', fontSize: 15 },
  minimumWarning: { fontFamily: 'Inter_500Medium', fontSize: 11 },
  disclaimer: { borderWidth: 1, borderRadius: 15, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 9 },
  disclaimerText: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 10, lineHeight: 16 },
  footer: { paddingHorizontal: 20, paddingVertical: 12 },
  placeButton: { minHeight: 53, borderRadius: 18, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  placeText: { fontFamily: 'Inter_700Bold', fontSize: 13 },
});
