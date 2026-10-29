import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  DEFAULT_RESTAURANT_ID,
  RESTAURANTS,
  type Language,
  type MenuProduct,
  type RestaurantConfig,
} from '@/data/restaurant-config';
import { t } from '@/lib/copy';
import { useColors } from '@/hooks/useColors';

const STORAGE_KEY = '@restaurant-preview/v1';

export interface CartLine {
  id: string;
  productId: string;
  name: string;
  nameAr: string;
  variantId?: string;
  variantName?: string;
  variantNameAr?: string;
  icon: MenuProduct['icon'];
  priceFils: number;
  quantity: number;
}

export interface DemoOrder {
  id: string;
  number: string;
  restaurantId: string;
  restaurantName: string;
  restaurantNameAr: string;
  createdAt: number;
  method: 'pickup' | 'delivery';
  deliveryArea?: string;
  lines: CartLine[];
  subtotalFils: number;
  deliveryFeeFils: number;
  totalFils: number;
  status: 'received';
}

export interface DemoRedemption {
  id: string;
  rewardName: string;
  rewardNameAr: string;
  pointsCost: number;
  code: string;
  createdAt: number;
}

interface TenantProfile {
  points: number;
  cart: CartLine[];
  orders: DemoOrder[];
  redemptions: DemoRedemption[];
  favorites: string[];
}

interface AppData {
  language: Language;
  restaurantId: string;
  tenants: Record<string, TenantProfile>;
}

interface AppContextValue {
  language: Language;
  isRTL: boolean;
  restaurant: RestaurantConfig;
  tenant: TenantProfile;
  cartCount: number;
  persistenceWarning: boolean;
  setLanguage: (language: Language) => void;
  setRestaurant: (restaurantId: string) => void;
  addToCart: (productId: string, variantId?: string) => boolean;
  updateCartQuantity: (lineId: string, quantity: number) => void;
  removeFromCart: (lineId: string) => void;
  clearCart: () => void;
  placeDemoOrder: (
    method: 'pickup' | 'delivery',
    deliveryArea?: string,
  ) => DemoOrder | null;
  redeemDemoReward: (rewardId: string) => DemoRedemption | null;
  toggleFavorite: (productId: string) => void;
}

const DEFAULT_POINTS: Record<string, number> = {
  'amman-coffee': 380,
  'jordan-burger': 520,
  'petra-pizza': 310,
  'sweet-spot': 445,
};

function createTenantProfile(restaurantId: string): TenantProfile {
  return {
    points: DEFAULT_POINTS[restaurantId] ?? 250,
    cart: [],
    orders: [],
    redemptions: [],
    favorites: [],
  };
}

function createInitialData(): AppData {
  return {
    language: 'ar',
    restaurantId: DEFAULT_RESTAURANT_ID,
    tenants: Object.fromEntries(
      Object.keys(RESTAURANTS).map((id) => [id, createTenantProfile(id)]),
    ),
  };
}

const AppContext = createContext<AppContextValue | null>(null);

function StorageGate({
  language,
  onRetry,
}: {
  language: Language;
  onRetry: () => void;
}) {
  const colors = useColors();
  const message = t('storageError', language);
  const retry = t('tryAgain', language);
  return (
    <View style={styles.gate}>
      <Text style={[styles.gateIcon, { backgroundColor: colors.accent, color: colors.primary }]}>!</Text>
      <Text style={[styles.gateText, { color: colors.foreground }]} accessibilityRole="alert">
        {message}
      </Text>
      <Pressable style={[styles.gateButton, { backgroundColor: colors.primary }]} onPress={onRetry} testID="storage-retry">
        <Text style={[styles.gateButtonText, { color: colors.primaryForeground }]}>{retry}</Text>
      </Pressable>
    </View>
  );
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(createInitialData);
  const [hydrated, setHydrated] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [persistenceWarning, setPersistenceWarning] = useState(false);

  const hydrate = useCallback(async () => {
    setLoadError(false);
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<AppData>;
        const initial = createInitialData();
        const restaurantId =
          parsed.restaurantId && RESTAURANTS[parsed.restaurantId]
            ? parsed.restaurantId
            : DEFAULT_RESTAURANT_ID;
        setData({
          ...initial,
          ...parsed,
          language: parsed.language === 'en' ? 'en' : 'ar',
          restaurantId,
          tenants: {
            ...initial.tenants,
            ...(parsed.tenants ?? {}),
          },
        });
      }
      setHydrated(true);
    } catch {
      setLoadError(true);
    }
  }, []);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!hydrated || loadError) return;
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      .then(() => setPersistenceWarning(false))
      .catch(() => setPersistenceWarning(true));
  }, [data, hydrated, loadError]);

  const language = data.language;
  const isRTL = language === 'ar';
  const restaurant = RESTAURANTS[data.restaurantId] ?? RESTAURANTS[DEFAULT_RESTAURANT_ID];
  const tenant =
    data.tenants[restaurant.id] ?? createTenantProfile(restaurant.id);

  const updateTenant = useCallback(
    (update: (current: TenantProfile) => TenantProfile) => {
      setData((current) => {
        const id = current.restaurantId;
        const profile = current.tenants[id] ?? createTenantProfile(id);
        return {
          ...current,
          tenants: { ...current.tenants, [id]: update(profile) },
        };
      });
    },
    [],
  );

  const setLanguage = useCallback((nextLanguage: Language) => {
    setData((current) => ({ ...current, language: nextLanguage }));
  }, []);

  const setRestaurant = useCallback((restaurantId: string) => {
    if (!RESTAURANTS[restaurantId]) return;
    setData((current) => ({ ...current, restaurantId }));
  }, []);

  const addToCart = useCallback(
    (productId: string, variantId?: string) => {
      const product = restaurant.products.find((item) => item.id === productId);
      if (!product) return false;
      const variant = product.variants?.find((item) => item.id === variantId);
      const lineId = `${product.id}:${variant?.id ?? 'default'}`;
      updateTenant((current) => {
        const existing = current.cart.find((line) => line.id === lineId);
        const line: CartLine = {
          id: lineId,
          productId: product.id,
          name: product.name,
          nameAr: product.nameAr,
          variantId: variant?.id,
          variantName: variant?.name,
          variantNameAr: variant?.nameAr,
          icon: product.icon,
          priceFils: variant?.priceFils ?? product.priceFils,
          quantity: (existing?.quantity ?? 0) + 1,
        };
        return {
          ...current,
          cart: existing
            ? current.cart.map((item) => (item.id === lineId ? line : item))
            : [...current.cart, line],
        };
      });
      return true;
    },
    [restaurant, updateTenant],
  );

  const updateCartQuantity = useCallback(
    (lineId: string, quantity: number) => {
      updateTenant((current) => ({
        ...current,
        cart:
          quantity <= 0
            ? current.cart.filter((line) => line.id !== lineId)
            : current.cart.map((line) =>
                line.id === lineId ? { ...line, quantity } : line,
              ),
      }));
    },
    [updateTenant],
  );

  const removeFromCart = useCallback(
    (lineId: string) => {
      updateTenant((current) => ({
        ...current,
        cart: current.cart.filter((line) => line.id !== lineId),
      }));
    },
    [updateTenant],
  );

  const clearCart = useCallback(() => {
    updateTenant((current) => ({ ...current, cart: [] }));
  }, [updateTenant]);

  const placeDemoOrder = useCallback(
    (method: 'pickup' | 'delivery', deliveryArea?: string) => {
      if (!tenant.cart.length) return null;
      if (method === 'delivery' && !restaurant.deliveryEnabled) return null;
      const subtotalFils = tenant.cart.reduce(
        (total, line) => total + line.priceFils * line.quantity,
        0,
      );
      if (subtotalFils < restaurant.minimumOrderFils) return null;
      const deliveryFeeFils =
        method === 'delivery' ? restaurant.deliveryFeeFils : 0;
      const order: DemoOrder = {
        id: `demo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        number: `#${String(Date.now()).slice(-5)}`,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        restaurantNameAr: restaurant.nameAr,
        createdAt: Date.now(),
        method,
        deliveryArea: method === 'delivery' ? deliveryArea : undefined,
        lines: tenant.cart.map((line) => ({ ...line })),
        subtotalFils,
        deliveryFeeFils,
        totalFils: subtotalFils + deliveryFeeFils,
        status: 'received',
      };
      updateTenant((current) => ({
        ...current,
        orders: [order, ...current.orders],
        cart: [],
      }));
      return order;
    },
    [restaurant, tenant, updateTenant],
  );

  const redeemDemoReward = useCallback(
    (rewardId: string) => {
      const reward = restaurant.rewards.find((item) => item.id === rewardId);
      if (!reward || tenant.points < reward.pointsCost) return null;
      const redemption = {
        id: `preview-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        rewardName: reward.name,
        rewardNameAr: reward.nameAr,
        pointsCost: reward.pointsCost,
        code: `PREVIEW-${String(Date.now()).slice(-6)}`,
        createdAt: Date.now(),
      };
      updateTenant((current) => ({
        ...current,
        points: current.points - reward.pointsCost,
        redemptions: [redemption, ...current.redemptions],
      }));
      return redemption;
    },
    [restaurant, tenant, updateTenant],
  );

  const toggleFavorite = useCallback(
    (productId: string) => {
      updateTenant((current) => ({
        ...current,
        favorites: current.favorites.includes(productId)
          ? current.favorites.filter((id) => id !== productId)
          : [...current.favorites, productId],
      }));
    },
    [updateTenant],
  );

  const value = useMemo<AppContextValue>(
    () => ({
      language,
      isRTL,
      restaurant,
      tenant,
      cartCount: tenant.cart.reduce((sum, line) => sum + line.quantity, 0),
      persistenceWarning,
      setLanguage,
      setRestaurant,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      placeDemoOrder,
      redeemDemoReward,
      toggleFavorite,
    }),
    [
      language,
      isRTL,
      restaurant,
      tenant,
      persistenceWarning,
      setLanguage,
      setRestaurant,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      placeDemoOrder,
      redeemDemoReward,
      toggleFavorite,
    ],
  );

  if (!hydrated && loadError) {
    return <StorageGate language={language} onRetry={() => void hydrate()} />;
  }
  if (!hydrated) return <LoadingGate color={restaurant.brand.primary} />;

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function LoadingGate({ color }: { color: string }) {
  const colors = useColors();
  return (
    <View style={[styles.loading, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={color} />
    </View>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider.');
  return context;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gate: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    gap: 16,
  },
  gateIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    textAlign: 'center',
    lineHeight: 42,
    fontSize: 24,
    fontWeight: '700',
  },
  gateText: {
    maxWidth: 320,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
  },
  gateButton: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 18,
  },
  gateButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
