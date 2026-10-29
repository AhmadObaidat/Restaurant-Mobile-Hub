import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandMark, DemoDataNotice } from '@/components/BrandElements';
import { useApp } from '@/context/AppContext';
import { RESTAURANT_LIST, type Language, type RestaurantConfig } from '@/data/restaurant-config';
import { t } from '@/lib/copy';
import { useColors } from '@/hooks/useColors';

export default function ProfileScreen() {
  const colors = useColors();
  const router = useRouter();
  const { language, isRTL, restaurant, tenant, setLanguage, setRestaurant, toggleFavorite } = useApp();
  const favoriteProducts = restaurant.products.filter((product) =>
    tenant.favorites.includes(product.id),
  );
  const languages: Array<{ id: Language; title: string }> = [
    { id: 'ar', title: t('arabic', language) },
    { id: 'en', title: t('english', language) },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={[styles.eyebrow, { color: restaurant.brand.primary }]}>{t('guestAccount', language)}</Text>
        <Text style={[styles.title, { color: colors.foreground, textAlign: isRTL ? 'right' : 'left' }]}>
          {t('profile', language)}
        </Text>

        <View style={[styles.profileCard, { backgroundColor: colors.card, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <BrandMark
            icon={restaurant.icon}
            background={restaurant.brand.pale}
            foreground={restaurant.brand.primary}
            size={56}
          />
          <View style={[styles.profileCopy, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
            <Text style={[styles.profileName, { color: colors.foreground }]}>{t('guestAccount', language)}</Text>
            <Text style={[styles.profileSub, { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'left' }]}>
              {language === 'ar' ? restaurant.nameAr : restaurant.name}
            </Text>
          </View>
          <View style={[styles.pointsPill, { backgroundColor: restaurant.brand.pale }]}>
            <MaterialCommunityIcons name="star-four-points" size={14} color={restaurant.brand.primary} />
            <Text style={[styles.pointsText, { color: restaurant.brand.primary }]}>
              {tenant.points.toLocaleString(language === 'ar' ? 'ar-JO' : 'en-JO')}
            </Text>
          </View>
        </View>

        <View style={[styles.infoCard, { backgroundColor: restaurant.brand.pale }]}>
          <MaterialCommunityIcons name="information-outline" size={18} color={restaurant.brand.primary} />
          <Text style={[styles.infoText, { color: restaurant.brand.ink, textAlign: isRTL ? 'right' : 'left' }]}>
            {t('guestNote', language)}
          </Text>
        </View>

        <View style={[styles.sectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t('language', language)}</Text>
        </View>
        <View style={[styles.languageRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          {languages.map((item) => {
            const selected = language === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => setLanguage(item.id)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                testID={`language-${item.id}`}
                style={[
                  styles.languageButton,
                  {
                    backgroundColor: selected ? restaurant.brand.primary : colors.card,
                    borderColor: selected ? restaurant.brand.primary : colors.border,
                  },
                ]}
              >
                <Text style={[styles.languageText, { color: selected ? colors.primaryForeground : colors.foreground }]}>
                  {item.title}
                </Text>
                {selected ? <MaterialCommunityIcons name="check" size={16} color={colors.primaryForeground} /> : null}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.section}>
          <View style={[styles.sectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t('brandPreview', language)}</Text>
            <Text style={[styles.previewTag, { color: restaurant.brand.primary, backgroundColor: restaurant.brand.pale }]}>
              {t('previewOnly', language)}
            </Text>
          </View>
          <Text style={[styles.sectionDescription, { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'left' }]}>
            {t('changeBrandNote', language)}
          </Text>
          <View style={styles.restaurantList}>
            {RESTAURANT_LIST.map((item) => (
              <RestaurantChoice
                key={item.id}
                restaurant={item}
                selected={restaurant.id === item.id}
                language={language}
                isRTL={isRTL}
                onPress={() => setRestaurant(item.id)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, textAlign: isRTL ? 'right' : 'left' }]}>
            {t('favorites', language)}
          </Text>
          {favoriteProducts.length ? (
            <View style={styles.restaurantList}>
              {favoriteProducts.map((product) => (
                <View
                  key={product.id}
                  style={[
                    styles.favoriteRow,
                    { backgroundColor: colors.card, flexDirection: isRTL ? 'row-reverse' : 'row' },
                  ]}
                >
                  <Pressable
                    onPress={() => router.push(`/product/${product.id}`)}
                    accessibilityRole="button"
                    testID={`favorite-${product.id}`}
                    style={[styles.favoriteOpen, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                  >
                    <MaterialCommunityIcons name={product.icon} size={20} color={restaurant.brand.primary} />
                    <Text style={[styles.restaurantName, { color: colors.foreground, textAlign: isRTL ? 'right' : 'left' }]}>
                      {language === 'ar' ? product.nameAr : product.name}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => toggleFavorite(product.id)}
                    accessibilityRole="button"
                    accessibilityLabel={t('remove', language)}
                    testID={`remove-favorite-${product.id}`}
                  >
                    <MaterialCommunityIcons name="heart" size={20} color={restaurant.brand.primary} />
                  </Pressable>
                </View>
              ))}
            </View>
          ) : (
            <Text style={[styles.sectionDescription, { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'left' }]}>
              {t('noFavorites', language)}
            </Text>
          )}
        </View>

        <View style={[styles.configCard, { backgroundColor: colors.card }]}>
          <View style={[styles.configHeading, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <MaterialCommunityIcons name="cellphone-cog" size={21} color={restaurant.brand.primary} />
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t('appConfiguration', language)}</Text>
          </View>
          <Text style={[styles.configLabel, { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'left' }]}>
            {t('plannedIdentifier', language)}
          </Text>
          <Text selectable style={[styles.appId, { color: colors.foreground, textAlign: isRTL ? 'right' : 'left' }]}>
            {restaurant.applicationId}
          </Text>
          <Text style={[styles.sectionDescription, { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'left' }]}>
            {t('identifierNote', language)}
          </Text>
        </View>

        <View style={[styles.hoursCard, { backgroundColor: colors.card, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <MaterialCommunityIcons name="clock-outline" size={20} color={restaurant.brand.primary} />
          <View style={styles.hoursCopy}>
            <Text style={[styles.hoursTitle, { color: colors.foreground }]}>{t('openingHours', language)}</Text>
            <Text style={[styles.sectionDescription, { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'left' }]}>
              {language === 'ar' ? restaurant.neighborhoodAr : restaurant.neighborhood}
            </Text>
          </View>
        </View>

        <View style={[styles.privacyCard, { backgroundColor: colors.card }]}>
          <View style={[styles.configHeading, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <MaterialCommunityIcons name="shield-lock-outline" size={20} color={restaurant.brand.primary} />
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t('privacy', language)}</Text>
          </View>
          <Text style={[styles.sectionDescription, { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'left' }]}>
            {t('privacyNote', language)}
          </Text>
        </View>
        <DemoDataNotice />
      </ScrollView>
    </SafeAreaView>
  );
}

function RestaurantChoice({
  restaurant,
  selected,
  language,
  isRTL,
  onPress,
}: {
  restaurant: RestaurantConfig;
  selected: boolean;
  language: Language;
  isRTL: boolean;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      testID={`restaurant-${restaurant.id}`}
      style={[
        styles.restaurantChoice,
        {
          backgroundColor: selected ? restaurant.brand.pale : colors.card,
          borderColor: selected ? restaurant.brand.primary : colors.border,
          flexDirection: isRTL ? 'row-reverse' : 'row',
        },
      ]}
    >
      <BrandMark icon={restaurant.icon} background={restaurant.brand.pale} foreground={restaurant.brand.primary} size={42} />
      <View style={[styles.restaurantCopy, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
        <Text style={[styles.restaurantName, { color: colors.foreground, textAlign: isRTL ? 'right' : 'left' }]}>
          {language === 'ar' ? restaurant.nameAr : restaurant.name}
        </Text>
        <Text style={[styles.restaurantArea, { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'left' }]}>
          {language === 'ar' ? restaurant.neighborhoodAr : restaurant.neighborhood}
        </Text>
      </View>
      <View style={[styles.colorDot, { backgroundColor: restaurant.brand.accent }]} />
      {selected ? <MaterialCommunityIcons name="check-circle" size={20} color={restaurant.brand.primary} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 20, paddingTop: 24, paddingBottom: 118, gap: 16 },
  eyebrow: { fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 0.7 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 27, marginTop: -11 },
  profileCard: { minHeight: 83, borderRadius: 21, padding: 13, alignItems: 'center', gap: 11 },
  profileCopy: { flex: 1, gap: 4 },
  profileName: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  profileSub: { fontFamily: 'Inter_400Regular', fontSize: 11 },
  pointsPill: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 14, paddingVertical: 6, paddingHorizontal: 8 },
  pointsText: { fontFamily: 'Inter_700Bold', fontSize: 11 },
  infoCard: { borderRadius: 16, padding: 13, flexDirection: 'row', gap: 9, alignItems: 'center' },
  infoText: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 18 },
  section: { gap: 8 },
  sectionHeader: { alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  sectionDescription: { fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 18 },
  languageRow: { gap: 10 },
  languageButton: { flex: 1, minHeight: 46, borderWidth: 1, borderRadius: 16, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  languageText: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  previewTag: { fontFamily: 'Inter_600SemiBold', fontSize: 9, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 5 },
  restaurantList: { gap: 8 },
  restaurantChoice: { minHeight: 62, borderWidth: 1, borderRadius: 17, padding: 9, alignItems: 'center', gap: 9 },
  favoriteRow: { minHeight: 54, borderRadius: 16, paddingHorizontal: 13, alignItems: 'center', gap: 12 },
  favoriteOpen: { flex: 1, minHeight: 54, alignItems: 'center', gap: 11 },
  restaurantCopy: { flex: 1, gap: 3 },
  restaurantName: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  restaurantArea: { fontFamily: 'Inter_400Regular', fontSize: 10 },
  colorDot: { width: 12, height: 12, borderRadius: 6 },
  configCard: { borderRadius: 19, padding: 15, gap: 8 },
  configHeading: { alignItems: 'center', gap: 8 },
  configLabel: { fontFamily: 'Inter_500Medium', fontSize: 10, marginTop: 4 },
  appId: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  hoursCard: { borderRadius: 18, minHeight: 65, padding: 14, alignItems: 'center', gap: 10 },
  hoursCopy: { flex: 1, gap: 4 },
  hoursTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  privacyCard: { borderRadius: 19, padding: 15, gap: 8 },
});
