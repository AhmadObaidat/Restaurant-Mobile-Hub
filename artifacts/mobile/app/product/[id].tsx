import React, { useState } from 'react';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CartShortcut } from '@/components/BrandElements';
import { useApp } from '@/context/AppContext';
import type { MenuProduct } from '@/data/restaurant-config';
import { t } from '@/lib/copy';
import { formatJod } from '@/lib/format';
import { useColors } from '@/hooks/useColors';

export default function ProductScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { language, isRTL, restaurant, tenant, addToCart, toggleFavorite } = useApp();
  const product = restaurant.products.find((item) => item.id === id);

  if (!product) {
    return (
      <SafeAreaView style={[styles.safe, styles.notFound, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
        <Text style={[styles.title, { color: colors.foreground }]}>{t('noMenuResults', language)}</Text>
        <Pressable onPress={() => router.back()} style={[styles.backButton, { backgroundColor: restaurant.brand.primary }]}>
          <Text style={[styles.buttonText, { color: colors.primaryForeground }]}>{t('continueBrowsing', language)}</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return <ProductDetails key={product.id} product={product} />;

  function ProductDetails({ product }: { product: MenuProduct }) {
    const [selectedVariantId, setSelectedVariantId] = useState(product.variants?.[0]?.id);
    const selectedVariant = product.variants?.find((variant) => variant.id === selectedVariantId);
    const isFavorite = tenant.favorites.includes(product.id);

    const add = async () => {
      if (addToCart(product.id, selectedVariantId)) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.push('/cart');
      }
    };

    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
        <View style={[styles.topBar, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Pressable
            onPress={() => router.back()}
            style={[styles.iconButton, { backgroundColor: colors.card }]}
            accessibilityRole="button"
            accessibilityLabel={t('continueBrowsing', language)}
            testID="product-back"
          >
            <Feather name={isRTL ? 'arrow-right' : 'arrow-left'} size={19} color={colors.foreground} />
          </Pressable>
          <Text style={[styles.topTitle, { color: colors.foreground }]}>{t('details', language)}</Text>
          <CartShortcut />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {product.id === 'flat-white' && restaurant.id === 'amman-coffee' ? (
            <ImageBackground
              source={require('../../assets/images/amman-coffee-hero.jpg')}
              style={styles.photo}
              imageStyle={styles.photoImage}
              resizeMode="cover"
            >
              <Pressable
                onPress={() => toggleFavorite(product.id)}
                style={[styles.favoriteButton, { backgroundColor: colors.background }]}
                accessibilityRole="button"
                accessibilityLabel={t('favorites', language)}
                testID="toggle-favorite"
              >
                <MaterialCommunityIcons
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={21}
                  color={isFavorite ? restaurant.brand.primary : colors.foreground}
                />
              </Pressable>
            </ImageBackground>
          ) : (
            <View style={[styles.artwork, { backgroundColor: restaurant.brand.pale }]}>
              <MaterialCommunityIcons name={product.icon} size={77} color={restaurant.brand.primary} />
              <Pressable
                onPress={() => toggleFavorite(product.id)}
                style={[styles.favoriteButton, { backgroundColor: colors.background }]}
                accessibilityRole="button"
                accessibilityLabel={t('favorites', language)}
                testID="toggle-favorite"
              >
                <MaterialCommunityIcons
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={21}
                  color={isFavorite ? restaurant.brand.primary : colors.foreground}
                />
              </Pressable>
            </View>
          )}

          <View style={[styles.productHeading, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
            <Text style={[styles.eyebrow, { color: restaurant.brand.primary }]}>
              {t(product.category, language)}
            </Text>
            <Text style={[styles.title, { color: colors.foreground, textAlign: isRTL ? 'right' : 'left' }]}>
              {language === 'ar' ? product.nameAr : product.name}
            </Text>
            <Text style={[styles.description, { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'left' }]}>
              {language === 'ar' ? product.descriptionAr : product.description}
            </Text>
          </View>

          {product.variants?.length ? (
            <View style={styles.variantSection}>
              <Text style={[styles.sectionTitle, { color: colors.foreground, textAlign: isRTL ? 'right' : 'left' }]}>
                {t('chooseSize', language)}
              </Text>
              <View style={[styles.variantRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                {product.variants.map((variant) => {
                  const selected = variant.id === selectedVariantId;
                  return (
                    <Pressable
                      key={variant.id}
                      onPress={() => setSelectedVariantId(variant.id)}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      testID={`variant-${variant.id}`}
                      style={[
                        styles.variant,
                        {
                          backgroundColor: selected ? restaurant.brand.pale : colors.card,
                          borderColor: selected ? restaurant.brand.primary : colors.border,
                        },
                      ]}
                    >
                      <Text style={[styles.variantName, { color: colors.foreground }]}>
                        {language === 'ar' ? variant.nameAr : variant.name}
                      </Text>
                      <Text style={[styles.variantPrice, { color: restaurant.brand.primary }]}>
                        {formatJod(variant.priceFils, language)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ) : null}
        </ScrollView>

        <View style={[styles.bottomAction, { backgroundColor: colors.background }]}>
          <Pressable
            onPress={() => void add()}
            style={[styles.addButton, { backgroundColor: restaurant.brand.primary }]}
            accessibilityRole="button"
            testID="add-product-to-cart"
          >
            <Text style={[styles.buttonText, { color: colors.primaryForeground }]}>
              {t('addToCart', language)}
            </Text>
            <Text style={[styles.buttonText, { color: colors.primaryForeground }]}>
              {formatJod(selectedVariant?.priceFils ?? product.priceFils, language)}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  notFound: { alignItems: 'center', justifyContent: 'center', padding: 24, gap: 18 },
  topBar: { minHeight: 54, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, gap: 12 },
  iconButton: { width: 42, height: 42, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  topTitle: { flex: 1, textAlign: 'center', fontFamily: 'Inter_700Bold', fontSize: 15 },
  content: { padding: 20, paddingBottom: 22, gap: 20 },
  photo: { height: 270, borderRadius: 25, overflow: 'hidden', alignItems: 'flex-end', padding: 13 },
  photoImage: { borderRadius: 25 },
  artwork: { height: 270, borderRadius: 25, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  favoriteButton: { width: 42, height: 42, borderRadius: 16, alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 13, right: 13 },
  productHeading: { gap: 6 },
  eyebrow: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 0.6 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 27, lineHeight: 34 },
  description: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 22 },
  variantSection: { gap: 12 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 17 },
  variantRow: { gap: 9 },
  variant: { flex: 1, minHeight: 65, borderWidth: 1, borderRadius: 17, padding: 11, justifyContent: 'space-between' },
  variantName: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  variantPrice: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  bottomAction: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 12 },
  addButton: { minHeight: 54, borderRadius: 19, paddingHorizontal: 17, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  buttonText: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  backButton: { minHeight: 45, paddingHorizontal: 18, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
});
