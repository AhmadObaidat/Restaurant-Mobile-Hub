import React, { useMemo, useState } from 'react';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandMark, CartShortcut } from '@/components/BrandElements';
import { useApp } from '@/context/AppContext';
import type { CategoryKey, MenuProduct } from '@/data/restaurant-config';
import { formatJod } from '@/lib/format';
import { t } from '@/lib/copy';
import { useColors } from '@/hooks/useColors';
import * as Haptics from 'expo-haptics';

export default function MenuScreen() {
  const colors = useColors();
  const router = useRouter();
  const { language, isRTL, restaurant, addToCart } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryKey | 'all'>('all');
  const categories: Array<CategoryKey | 'all'> = ['all', ...restaurant.categories];
  const products = useMemo(
    () =>
      restaurant.products.filter((product) => {
        const query = search.trim().toLocaleLowerCase();
        const matchesSearch =
          !query ||
          product.name.toLocaleLowerCase().includes(query) ||
          product.nameAr.includes(search.trim()) ||
          product.description.toLocaleLowerCase().includes(query);
        const matchesCategory = category === 'all' || product.category === category;
        return matchesSearch && matchesCategory;
      }),
    [category, restaurant.products, search],
  );

  const handleQuickAdd = async (product: MenuProduct) => {
    const added = addToCart(product.id, product.variants?.[0]?.id);
    if (added) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <KeyboardAvoidingView behavior="padding" style={styles.keyboard}>
        <View style={styles.header}>
          <View style={[styles.brandArea, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <BrandMark
              icon={restaurant.icon}
              background={restaurant.brand.pale}
              foreground={restaurant.brand.primary}
              size={42}
            />
            <View style={{ alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
              <Text style={[styles.eyebrow, { color: restaurant.brand.primary }]}>
                {t('browseMenu', language)}
              </Text>
              <Text style={[styles.restaurantName, { color: colors.foreground }]}>
                {language === 'ar' ? restaurant.nameAr : restaurant.name}
              </Text>
            </View>
          </View>
          <CartShortcut />
        </View>

        <View style={[styles.searchBox, { backgroundColor: colors.card, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Feather name="search" size={18} color={colors.mutedForeground} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={t('search', language)}
            placeholderTextColor={colors.mutedForeground}
            returnKeyType="search"
            onSubmitEditing={Keyboard.dismiss}
            accessibilityLabel={t('search', language)}
            testID="menu-search"
            style={[
              styles.searchInput,
              { textAlign: isRTL ? 'right' : 'left', writingDirection: isRTL ? 'rtl' : 'ltr' },
            ]}
          />
          {search ? (
            <Pressable
              onPress={() => setSearch('')}
              accessibilityRole="button"
              accessibilityLabel={t('remove', language)}
              testID="clear-search"
            >
              <Feather name="x-circle" size={17} color={colors.mutedForeground} />
            </Pressable>
          ) : null}
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.categories, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
          >
            {categories.map((key) => {
              const selected = category === key;
              const label = key === 'all' ? t('all', language) : t(key, language);
              return (
                <Pressable
                  key={key}
                  onPress={() => setCategory(key)}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  testID={`category-${key}`}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor: selected ? restaurant.brand.primary : colors.card,
                      borderColor: selected ? restaurant.brand.primary : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      { color: selected ? colors.primaryForeground : colors.foreground },
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Text style={[styles.resultCount, { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'left' }]}>
            {products.length} · {t('menu', language)}
          </Text>

          {products.length ? (
            <View style={styles.productList}>
              {products.map((product) => (
                <Pressable
                  key={product.id}
                  onPress={() => router.push(`/product/${product.id}`)}
                  accessibilityRole="button"
                  testID={`product-${product.id}`}
                  style={[
                    styles.productCard,
                    { backgroundColor: colors.card, flexDirection: isRTL ? 'row-reverse' : 'row' },
                  ]}
                >
                  <View style={[styles.productIcon, { backgroundColor: restaurant.brand.pale }]}>
                    <MaterialCommunityIcons
                      name={product.icon}
                      size={27}
                      color={restaurant.brand.primary}
                    />
                  </View>
                  <View style={[styles.productCopy, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                    <Text style={[styles.productName, { color: colors.foreground, textAlign: isRTL ? 'right' : 'left' }]}>
                      {language === 'ar' ? product.nameAr : product.name}
                    </Text>
                    <Text
                      numberOfLines={2}
                      style={[styles.productDescription, { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'left' }]}
                    >
                      {language === 'ar' ? product.descriptionAr : product.description}
                    </Text>
                    <Text style={[styles.productPrice, { color: restaurant.brand.primary }]}>
                      {product.variants?.length
                        ? `${t('startingAt', language)} ${formatJod(product.priceFils, language)}`
                        : formatJod(product.priceFils, language)}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => void handleQuickAdd(product)}
                    accessibilityRole="button"
                    accessibilityLabel={`${t('addToCart', language)} ${language === 'ar' ? product.nameAr : product.name}`}
                    testID={`quick-add-${product.id}`}
                    style={[styles.addButton, { backgroundColor: restaurant.brand.primary }]}
                  >
                    <Feather name="plus" size={20} color={colors.primaryForeground} />
                  </Pressable>
                </Pressable>
              ))}
            </View>
          ) : (
            <View style={[styles.empty, { backgroundColor: colors.card }]}>
              <MaterialCommunityIcons
                name="magnify"
                size={35}
                color={restaurant.brand.accent}
                accessibilityLabel={t('menu', language)}
              />
              <Text style={[styles.emptyText, { color: colors.foreground }]}>
                {t('noMenuResults', language)}
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  keyboard: { flex: 1 },
  header: {
    minHeight: 58,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  brandArea: { flexDirection: 'row', alignItems: 'center', gap: 11, flex: 1 },
  eyebrow: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 0.7 },
  restaurantName: { fontFamily: 'Inter_700Bold', fontSize: 15, marginTop: 2 },
  searchBox: {
    minHeight: 48,
    borderRadius: 17,
    marginHorizontal: 20,
    marginTop: 16,
    paddingHorizontal: 14,
    alignItems: 'center',
    gap: 10,
  },
  searchInput: { flex: 1, paddingVertical: 11, fontSize: 14 },
  content: { padding: 20, paddingBottom: 120 },
  categories: { gap: 8, paddingBottom: 16 },
  categoryChip: {
    minHeight: 38,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  resultCount: { fontFamily: 'Inter_500Medium', fontSize: 12, marginBottom: 12 },
  productList: { gap: 10 },
  productCard: {
    minHeight: 124,
    borderRadius: 21,
    padding: 12,
    alignItems: 'center',
    gap: 11,
  },
  productIcon: {
    width: 58,
    height: 64,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productCopy: { flex: 1, alignItems: 'flex-start', gap: 4 },
  productName: { fontFamily: 'Inter_700Bold', fontSize: 15, lineHeight: 20 },
  productDescription: { fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 16 },
  productPrice: { fontFamily: 'Inter_700Bold', fontSize: 13, marginTop: 2 },
  addButton: {
    width: 35,
    height: 35,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    minHeight: 190,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 22,
    gap: 12,
  },
  emptyText: { textAlign: 'center', fontFamily: 'Inter_500Medium', fontSize: 14, lineHeight: 21 },
});
