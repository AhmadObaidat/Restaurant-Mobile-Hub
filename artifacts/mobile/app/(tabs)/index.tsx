import React from 'react';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BrandMark,
  CartShortcut,
  DemoDataNotice,
  SectionHeading,
} from '@/components/BrandElements';
import { useApp } from '@/context/AppContext';
import { getProductPrice } from '@/data/restaurant-config';
import { formatJod } from '@/lib/format';
import { t } from '@/lib/copy';
import { useColors } from '@/hooks/useColors';

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const { language, isRTL, restaurant, tenant } = useApp();
  const featured = restaurant.products.filter((product) => product.featured);
  const nextReward = restaurant.rewards
    .filter((reward) => reward.pointsCost > tenant.points)
    .sort((a, b) => a.pointsCost - b.pointsCost)[0];
  const nextTarget = nextReward?.pointsCost ?? Math.max(tenant.points, 1);
  const progress = Math.min(tenant.points / nextTarget, 1);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingTop: Platform.OS === 'web' ? 67 : 10 },
        ]}
      >
        <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={[styles.brandArea, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <BrandMark
              icon={restaurant.icon}
              background={restaurant.brand.pale}
              foreground={restaurant.brand.primary}
              size={46}
            />
            <View style={{ alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
              <Text style={[styles.headerEyebrow, { color: colors.mutedForeground }]}>
                {t('location', language)}
              </Text>
              <Text style={[styles.headerName, { color: colors.foreground }]}>
                {language === 'ar' ? restaurant.nameAr : restaurant.name}
              </Text>
            </View>
          </View>
          <CartShortcut />
        </View>

        <View style={styles.intro}>
          <Text style={[styles.hello, { color: restaurant.brand.primary, textAlign: isRTL ? 'right' : 'left' }]}>
            {t('hello', language)}، {t('guest', language)}
          </Text>
          <Text style={[styles.homeTitle, { color: colors.foreground, textAlign: isRTL ? 'right' : 'left' }]}>
            {language === 'ar' ? restaurant.taglineAr : restaurant.tagline}
          </Text>
        </View>

        {restaurant.id === 'amman-coffee' ? (
          <ImageBackground
            source={require('../../assets/images/amman-coffee-hero.jpg')}
            style={styles.hero}
            imageStyle={styles.heroImage}
            resizeMode="cover"
            accessibilityLabel={t('thisWeek', language)}
          >
            <LinearGradient
              colors={['transparent', `${restaurant.brand.ink}E8`]}
              style={styles.heroShade}
            >
              <Text style={[styles.heroEyebrow, { color: colors.primaryForeground }]}>{t('thisWeek', language)}</Text>
              <Text style={[styles.heroTitle, { color: colors.primaryForeground, textAlign: isRTL ? 'right' : 'left' }]}>
                {t('homeTitle', language)}
              </Text>
              <Pressable
                style={[
                  styles.heroButton,
                  {
                    alignSelf: isRTL ? 'flex-end' : 'flex-start',
                    backgroundColor: colors.card,
                  },
                ]}
                onPress={() => router.push('/(tabs)/menu')}
                accessibilityRole="button"
                testID="hero-browse-menu"
              >
                <Text style={[styles.heroButtonText, { color: colors.foreground }]}>
                  {t('browseMenu', language)}
                </Text>
                <Feather
                  name={isRTL ? 'arrow-left' : 'arrow-right'}
                  size={15}
                  color={colors.foreground}
                />
              </Pressable>
            </LinearGradient>
          </ImageBackground>
        ) : (
          <View style={[styles.brandHero, { backgroundColor: restaurant.brand.pale }]}>
            <View style={styles.brandHeroMark}>
              <MaterialCommunityIcons
                name={restaurant.icon}
                size={70}
                color={restaurant.brand.primary}
              />
            </View>
            <Text style={[styles.brandHeroEyebrow, { color: restaurant.brand.primary }]}>
              {t('thisWeek', language)}
            </Text>
            <Text style={[styles.brandHeroTitle, { color: restaurant.brand.ink, textAlign: isRTL ? 'right' : 'left' }]}>
              {language === 'ar' ? restaurant.taglineAr : restaurant.tagline}
            </Text>
            <Pressable
              style={[styles.brandHeroButton, { backgroundColor: restaurant.brand.primary }]}
              onPress={() => router.push('/(tabs)/menu')}
              accessibilityRole="button"
              testID="brand-browse-menu"
            >
              <Text style={[styles.heroButtonText, { color: colors.primaryForeground }]}>
                {t('browseMenu', language)}
              </Text>
              <Feather name={isRTL ? 'arrow-left' : 'arrow-right'} size={15} color={colors.primaryForeground} />
            </Pressable>
          </View>
        )}

        <Pressable
          style={[styles.loyaltyCard, { backgroundColor: restaurant.brand.primary }]}
          onPress={() => router.push('/(tabs)/rewards')}
          accessibilityRole="button"
          testID="home-loyalty-card"
        >
          <View style={[styles.loyaltyTop, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={{ alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
              <Text style={[styles.cardEyebrow, { color: colors.primaryForeground }]}>{t('loyaltyCard', language)}</Text>
              <Text style={[styles.pointsNumber, { color: colors.primaryForeground, textAlign: isRTL ? 'right' : 'left' }]}>
                {tenant.points.toLocaleString(language === 'ar' ? 'ar-JO' : 'en-JO')}
              </Text>
              <Text style={[styles.pointsLabel, { color: colors.primaryForeground }]}>{t('points', language)}</Text>
            </View>
            <View style={styles.goldBadge}>
              <MaterialCommunityIcons name="star-four-points" size={14} color={restaurant.brand.ink} />
              <Text style={[styles.goldText, { color: restaurant.brand.ink }]}>{t('memberTier', language)}</Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress * 100}%`, backgroundColor: restaurant.brand.accent },
              ]}
            />
          </View>
          <Text style={[styles.progressLabel, { color: colors.primaryForeground, textAlign: isRTL ? 'right' : 'left' }]}>
            {nextReward
              ? `${Math.max(nextReward.pointsCost - tenant.points, 0)} ${t('pointsProgress', language)}`
              : t('pointsToReward', language)}
          </Text>
        </Pressable>

        <View style={styles.section}>
          <SectionHeading
            title={t('featured', language)}
            action={t('seeAll', language)}
            onAction={() => router.push('/(tabs)/menu')}
            align={isRTL ? 'right' : 'left'}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.featuredRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
          >
            {featured.map((product) => (
              <Pressable
                key={product.id}
                onPress={() => router.push(`/product/${product.id}`)}
                accessibilityRole="button"
                testID={`featured-${product.id}`}
                style={[styles.featureCard, { backgroundColor: colors.card }]}
              >
                <View style={[styles.featureIcon, { backgroundColor: restaurant.brand.pale }]}>
                  <MaterialCommunityIcons
                    name={product.icon}
                    size={31}
                    color={restaurant.brand.primary}
                  />
                </View>
                <Text style={[styles.featureName, { color: colors.foreground, textAlign: isRTL ? 'right' : 'left' }]}>
                  {language === 'ar' ? product.nameAr : product.name}
                </Text>
                <Text style={[styles.featurePrice, { color: restaurant.brand.primary }]}>
                  {formatJod(getProductPrice(product, product.variants?.[0]?.id), language)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <Pressable
          onPress={() => router.push('/(tabs)/rewards')}
          style={[styles.challengeCard, { backgroundColor: colors.card, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
          accessibilityRole="button"
          testID="home-challenge"
        >
          <View style={[styles.challengeIcon, { backgroundColor: restaurant.brand.pale }]}>
            <MaterialCommunityIcons name="calendar-star" size={24} color={restaurant.brand.primary} />
          </View>
          <View style={[styles.challengeCopy, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
            <Text style={[styles.challengeEyebrow, { color: restaurant.brand.primary }]}>{t('activeChallenge', language)}</Text>
            <Text style={[styles.challengeTitle, { color: colors.foreground, textAlign: isRTL ? 'right' : 'left' }]}>
              {language === 'ar' ? restaurant.challenge.titleAr : restaurant.challenge.title}
            </Text>
            <Text style={[styles.challengeDescription, { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'left' }]}>
              {language === 'ar' ? restaurant.challenge.descriptionAr : restaurant.challenge.description}
            </Text>
          </View>
          <Text style={[styles.challengeProgress, { color: restaurant.brand.primary }]}>
            {restaurant.challenge.progress}/{restaurant.challenge.target}
          </Text>
        </Pressable>

        <DemoDataNotice />
        <Text style={[styles.footerNote, { color: colors.mutedForeground, textAlign: 'center' }]}>
          {t('tasteNote', language)}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 112, gap: 18 },
  header: { alignItems: 'center', justifyContent: 'space-between' },
  brandArea: { alignItems: 'center', gap: 10, flex: 1 },
  headerEyebrow: { fontFamily: 'Inter_400Regular', fontSize: 11 },
  headerName: { fontFamily: 'Inter_700Bold', fontSize: 15, marginTop: 2 },
  intro: { gap: 5, marginTop: 3 },
  hello: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  homeTitle: { fontFamily: 'Inter_700Bold', fontSize: 25, lineHeight: 33 },
  hero: { minHeight: 215, borderRadius: 25, overflow: 'hidden', justifyContent: 'flex-end' },
  heroImage: { borderRadius: 25 },
  heroShade: { minHeight: 215, justifyContent: 'flex-end', padding: 18, gap: 8 },
  heroEyebrow: { fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 1.1 },
  heroTitle: { maxWidth: 275, fontFamily: 'Inter_700Bold', fontSize: 22, lineHeight: 29 },
  heroButton: {
    minHeight: 38,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 15,
    paddingHorizontal: 12,
    marginTop: 3,
  },
  heroButtonText: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  brandHero: { minHeight: 215, borderRadius: 25, overflow: 'hidden', padding: 19, justifyContent: 'flex-end', gap: 8 },
  brandHeroMark: { position: 'absolute', top: 20, right: 22, opacity: 0.42 },
  brandHeroEyebrow: { fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 1.1 },
  brandHeroTitle: { maxWidth: 270, fontFamily: 'Inter_700Bold', fontSize: 23, lineHeight: 30 },
  brandHeroButton: { minHeight: 38, borderRadius: 15, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, marginTop: 3 },
  loyaltyCard: { borderRadius: 24, padding: 17, gap: 10 },
  loyaltyTop: { alignItems: 'flex-start', justifyContent: 'space-between' },
  cardEyebrow: { opacity: 0.8, fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 0.8 },
  pointsNumber: { fontFamily: 'Inter_700Bold', fontSize: 31, lineHeight: 37, marginTop: 4 },
  pointsLabel: { opacity: 0.88, fontFamily: 'Inter_500Medium', fontSize: 12 },
  goldBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 14, paddingHorizontal: 9, paddingVertical: 7 },
  goldText: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 0.45 },
  progressTrack: { height: 6, borderRadius: 4, overflow: 'hidden', marginTop: 1 },
  progressFill: { height: 6, borderRadius: 4 },
  progressLabel: { opacity: 0.88, fontFamily: 'Inter_500Medium', fontSize: 11 },
  section: { gap: 1 },
  featuredRow: { gap: 11, paddingBottom: 2 },
  featureCard: { width: 144, minHeight: 155, borderRadius: 21, padding: 12, justifyContent: 'space-between' },
  featureIcon: { height: 76, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  featureName: { fontFamily: 'Inter_700Bold', fontSize: 13, marginTop: 9 },
  featurePrice: { fontFamily: 'Inter_600SemiBold', fontSize: 12, marginTop: 3 },
  challengeCard: { minHeight: 90, borderRadius: 20, alignItems: 'center', gap: 11, padding: 13 },
  challengeIcon: { width: 44, height: 44, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  challengeCopy: { flex: 1, alignItems: 'flex-start' },
  challengeEyebrow: { fontFamily: 'Inter_600SemiBold', fontSize: 10 },
  challengeTitle: { fontFamily: 'Inter_700Bold', fontSize: 14, marginTop: 3 },
  challengeDescription: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 2 },
  challengeProgress: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  footerNote: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: -7 },
});
