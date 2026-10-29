import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DemoDataNotice } from '@/components/BrandElements';
import { useApp } from '@/context/AppContext';
import { formatDate } from '@/lib/format';
import { t } from '@/lib/copy';
import { useColors } from '@/hooks/useColors';

export default function RewardsScreen() {
  const colors = useColors();
  const router = useRouter();
  const { language, isRTL, restaurant, tenant, redeemDemoReward } = useApp();
  const challenge = restaurant.challenge;
  const progress = Math.min(challenge.progress / challenge.target, 1);

  const handleRedeem = async (rewardId: string) => {
    const result = redeemDemoReward(rewardId);
    if (!result) {
      Alert.alert(t('rewards', language), t('insufficientPoints', language));
      return;
    }
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      t('rewardUnlocked', language),
      `${result.code} · ${t('rewardNote', language)}`,
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={[styles.headingRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={{ alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
            <Text style={[styles.eyebrow, { color: restaurant.brand.primary }]}>{t('loyaltyCard', language)}</Text>
            <Text style={[styles.title, { color: colors.foreground, textAlign: isRTL ? 'right' : 'left' }]}>
              {t('rewards', language)}
            </Text>
          </View>
          <Pressable
            onPress={() => router.push('/cart')}
            style={[styles.pointsPill, { backgroundColor: restaurant.brand.pale }]}
            accessibilityRole="button"
            testID="rewards-cart"
          >
            <MaterialCommunityIcons name="star-four-points" size={15} color={restaurant.brand.primary} />
            <Text style={[styles.pointsText, { color: restaurant.brand.primary }]}>
              {tenant.points.toLocaleString(language === 'ar' ? 'ar-JO' : 'en-JO')}
            </Text>
          </Pressable>
        </View>

        <View style={[styles.challenge, { backgroundColor: restaurant.brand.primary }]}>
          <View style={[styles.challengeHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={[styles.challengeIcon, { backgroundColor: colors.brandVeil }]}>
              <MaterialCommunityIcons name="calendar-star" size={24} color={colors.primaryForeground} />
            </View>
            <View style={[styles.challengeWords, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
              <Text style={[styles.challengeEyebrow, { color: colors.primaryForeground }]}>{t('challenge', language)}</Text>
              <Text style={[styles.challengeTitle, { color: colors.primaryForeground, textAlign: isRTL ? 'right' : 'left' }]}>
                {language === 'ar' ? challenge.titleAr : challenge.title}
              </Text>
              <Text style={[styles.challengeDescription, { color: colors.primaryForeground, textAlign: isRTL ? 'right' : 'left' }]}>
                {language === 'ar' ? challenge.descriptionAr : challenge.description}
              </Text>
            </View>
          </View>
          <View style={styles.challengeTrack}>
            <View style={[styles.challengeFill, { width: `${progress * 100}%`, backgroundColor: restaurant.brand.accent }]} />
          </View>
          <View style={[styles.challengeFooter, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={[styles.challengeMeta, { color: colors.primaryForeground }]}>
              {challenge.progress} {t('progress', language)} {challenge.target}
            </Text>
            <Text style={[styles.challengeMeta, { color: colors.primaryForeground }]}>+{challenge.rewardPoints} {t('challengeReward', language)}</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.foreground, textAlign: isRTL ? 'right' : 'left' }]}>
          {t('rewards', language)}
        </Text>
        <View style={styles.rewardList}>
          {restaurant.rewards.map((reward) => {
            const canRedeem = tenant.points >= reward.pointsCost;
            return (
              <View
                key={reward.id}
                style={[
                  styles.rewardCard,
                  { backgroundColor: colors.card, flexDirection: isRTL ? 'row-reverse' : 'row' },
                ]}
              >
                <View style={[styles.rewardIcon, { backgroundColor: restaurant.brand.pale }]}>
                  <MaterialCommunityIcons name={reward.icon} size={25} color={restaurant.brand.primary} />
                </View>
                <View style={[styles.rewardCopy, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                  <Text style={[styles.rewardName, { color: colors.foreground, textAlign: isRTL ? 'right' : 'left' }]}>
                    {language === 'ar' ? reward.nameAr : reward.name}
                  </Text>
                  <Text style={[styles.rewardDescription, { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'left' }]}>
                    {language === 'ar' ? reward.descriptionAr : reward.description}
                  </Text>
                  <View style={[styles.costRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <MaterialCommunityIcons name="star-four-points" size={13} color={restaurant.brand.accent} />
                    <Text style={[styles.costText, { color: restaurant.brand.primary }]}>
                      {reward.pointsCost} {t('points', language)}
                    </Text>
                  </View>
                </View>
                <Pressable
                  onPress={() => void handleRedeem(reward.id)}
                  disabled={!canRedeem}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: !canRedeem }}
                  testID={`redeem-${reward.id}`}
                  style={[
                    styles.redeemButton,
                    { backgroundColor: canRedeem ? restaurant.brand.primary : colors.muted },
                  ]}
                >
                  <Text style={[styles.redeemText, { color: canRedeem ? colors.primaryForeground : colors.mutedForeground }]}>
                    {t('redeem', language)}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>

        {tenant.redemptions.length ? (
          <View style={styles.redemptions}>
            <Text style={[styles.sectionTitle, { color: colors.foreground, textAlign: isRTL ? 'right' : 'left' }]}>
              {t('savedLocally', language)}
            </Text>
            {tenant.redemptions.slice(0, 3).map((redemption) => (
              <View key={redemption.id} style={[styles.redemptionRow, { backgroundColor: colors.card, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <MaterialCommunityIcons name="ticket-confirmation-outline" size={21} color={restaurant.brand.primary} />
                <View style={styles.redemptionCopy}>
                  <Text style={[styles.rewardName, { color: colors.foreground, textAlign: isRTL ? 'right' : 'left' }]}>
                    {language === 'ar' ? redemption.rewardNameAr : redemption.rewardName}
                  </Text>
                  <Text style={[styles.rewardDescription, { color: colors.mutedForeground }]}>
                    {redemption.code} · {formatDate(redemption.createdAt, language)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : null}

        <DemoDataNotice />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 118, gap: 17 },
  headingRow: { alignItems: 'center', justifyContent: 'space-between' },
  eyebrow: { fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 0.7 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 27, marginTop: 4 },
  pointsPill: { minHeight: 38, borderRadius: 18, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12 },
  pointsText: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  challenge: { borderRadius: 23, padding: 16, gap: 13 },
  challengeHeader: { alignItems: 'center', gap: 12 },
  challengeIcon: { width: 45, height: 45, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  challengeWords: { flex: 1 },
  challengeEyebrow: { opacity: 0.75, fontFamily: 'Inter_600SemiBold', fontSize: 10 },
  challengeTitle: { fontFamily: 'Inter_700Bold', fontSize: 17, marginTop: 3 },
  challengeDescription: { opacity: 0.83, fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 3 },
  challengeTrack: { height: 6, borderRadius: 4, overflow: 'hidden' },
  challengeFill: { height: 6, borderRadius: 4 },
  challengeFooter: { justifyContent: 'space-between' },
  challengeMeta: { fontFamily: 'Inter_500Medium', fontSize: 11 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 19, marginTop: 2 },
  rewardList: { gap: 10 },
  rewardCard: { minHeight: 108, borderRadius: 21, padding: 12, alignItems: 'center', gap: 10 },
  rewardIcon: { width: 49, height: 51, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  rewardCopy: { flex: 1, gap: 3 },
  rewardName: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  rewardDescription: { fontFamily: 'Inter_400Regular', fontSize: 10, lineHeight: 15 },
  costRow: { alignItems: 'center', gap: 4, marginTop: 3 },
  costText: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
  redeemButton: { minHeight: 35, minWidth: 71, borderRadius: 13, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  redeemText: { fontFamily: 'Inter_700Bold', fontSize: 10 },
  redemptions: { gap: 10 },
  redemptionRow: { minHeight: 62, borderRadius: 16, alignItems: 'center', gap: 10, padding: 12 },
  redemptionCopy: { flex: 1 },
});
