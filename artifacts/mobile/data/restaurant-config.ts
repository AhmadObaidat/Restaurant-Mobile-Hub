import type { ComponentProps } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export type Language = 'ar' | 'en';
export type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
export type CategoryKey =
  | 'coffee'
  | 'tea'
  | 'coldDrinks'
  | 'pastries'
  | 'burgers'
  | 'sides'
  | 'pizza'
  | 'desserts'
  | 'bread';

export interface ProductVariant {
  id: string;
  name: string;
  nameAr: string;
  priceFils: number;
}

export interface MenuProduct {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  category: CategoryKey;
  priceFils: number;
  icon: IconName;
  featured?: boolean;
  variants?: ProductVariant[];
}

export interface Reward {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  pointsCost: number;
  icon: IconName;
}

export interface RestaurantConfig {
  id: string;
  name: string;
  nameAr: string;
  tagline: string;
  taglineAr: string;
  neighborhood: string;
  neighborhoodAr: string;
  icon: IconName;
  applicationId: string;
  brand: {
    primary: string;
    accent: string;
    pale: string;
    ink: string;
  };
  currency: 'JOD';
  deliveryEnabled: boolean;
  deliveryFeeFils: number;
  minimumOrderFils: number;
  categories: CategoryKey[];
  products: MenuProduct[];
  rewards: Reward[];
  challenge: {
    title: string;
    titleAr: string;
    description: string;
    descriptionAr: string;
    progress: number;
    target: number;
    rewardPoints: number;
  };
}

const coffeeVariants = [
  { id: 'regular', name: 'Regular', nameAr: 'عادي', priceFils: 3500 },
  { id: 'large', name: 'Large', nameAr: 'كبير', priceFils: 4250 },
];

export const RESTAURANTS: Record<string, RestaurantConfig> = {
  'amman-coffee': {
    id: 'amman-coffee',
    name: 'Amman Coffee House',
    nameAr: 'قهوة عمّان',
    tagline: 'A little pause, made perfectly.',
    taglineAr: 'استراحة صغيرة، بمذاق مثالي.',
    neighborhood: 'Shmeisani, Amman',
    neighborhoodAr: 'الشميساني، عمّان',
    icon: 'coffee-outline',
    applicationId: 'com.ammancoffeehouse.app',
    brand: {
      primary: '#704633',
      accent: '#C58A57',
      pale: '#F3E6D7',
      ink: '#35261F',
    },
    currency: 'JOD',
    deliveryEnabled: true,
    deliveryFeeFils: 750,
    minimumOrderFils: 2500,
    categories: ['coffee', 'tea', 'coldDrinks', 'pastries'],
    products: [
      {
        id: 'flat-white',
        name: 'Flat white',
        nameAr: 'فلات وايت',
        description: 'Double espresso, velvety steamed milk.',
        descriptionAr: 'إسبريسو مزدوج مع حليب مبخر ناعم.',
        category: 'coffee',
        priceFils: 3500,
        icon: 'coffee',
        featured: true,
        variants: coffeeVariants,
      },
      {
        id: 'cardamom-latte',
        name: 'Cardamom latte',
        nameAr: 'لاتيه بالهيل',
        description: 'A house latte with a gentle cardamom finish.',
        descriptionAr: 'لاتيه بقهوة الدار ولمسة خفيفة من الهيل.',
        category: 'coffee',
        priceFils: 3750,
        icon: 'coffee-outline',
        featured: true,
        variants: [
          { id: 'regular', name: 'Regular', nameAr: 'عادي', priceFils: 3750 },
          { id: 'large', name: 'Large', nameAr: 'كبير', priceFils: 4500 },
        ],
      },
      {
        id: 'iced-pistachio',
        name: 'Iced pistachio',
        nameAr: 'قهوة بالفستق المثلجة',
        description: 'Cold espresso, pistachio cream, a little crunch.',
        descriptionAr: 'إسبريسو بارد وكريمة الفستق مع قرمشة خفيفة.',
        category: 'coldDrinks',
        priceFils: 4500,
        icon: 'cup',
        featured: true,
      },
      {
        id: 'date-maamoul',
        name: 'Date maamoul',
        nameAr: 'معمول بالتمر',
        description: 'Two small-batch date cookies, baked this morning.',
        descriptionAr: 'حبتان من معمول التمر المحضّر هذا الصباح.',
        category: 'pastries',
        priceFils: 2500,
        icon: 'cookie-outline',
      },
      {
        id: 'mint-tea',
        name: 'Fresh mint tea',
        nameAr: 'شاي بالنعناع الطازج',
        description: 'Black tea steeped with fresh mint leaves.',
        descriptionAr: 'شاي أسود منقوع مع أوراق النعناع الطازجة.',
        category: 'tea',
        priceFils: 2000,
        icon: 'tea-outline',
      },
    ],
    rewards: [
      {
        id: 'free-espresso',
        name: 'A coffee on us',
        nameAr: 'قهوة على حسابنا',
        description: 'Choose any regular espresso drink.',
        descriptionAr: 'اختر مشروب إسبريسو عادي من قائمتنا.',
        pointsCost: 250,
        icon: 'coffee',
      },
      {
        id: 'pastry-pair',
        name: 'Coffee & maamoul',
        nameAr: 'قهوة ومعمول',
        description: 'A regular coffee paired with date maamoul.',
        descriptionAr: 'قهوة عادية مع معمول بالتمر.',
        pointsCost: 420,
        icon: 'cookie-outline',
      },
      {
        id: 'house-special',
        name: 'House special',
        nameAr: 'مشروب الدار المميز',
        description: 'One signature drink, any size.',
        descriptionAr: 'مشروب مميز من اختيارك، بأي حجم.',
        pointsCost: 650,
        icon: 'cup',
      },
    ],
    challenge: {
      title: 'Your morning ritual',
      titleAr: 'طقوس صباحك',
      description: 'Stop by on 3 different days this week.',
      descriptionAr: 'زرنا في ٣ أيام مختلفة هذا الأسبوع.',
      progress: 2,
      target: 3,
      rewardPoints: 60,
    },
  },
  'jordan-burger': {
    id: 'jordan-burger',
    name: 'Jordan Burger Co.',
    nameAr: 'برغر الأردن',
    tagline: 'Big flavor. Local heart.',
    taglineAr: 'نكهة غنية، بروح محلية.',
    neighborhood: 'Jabal Amman',
    neighborhoodAr: 'جبل عمّان',
    icon: 'hamburger',
    applicationId: 'com.jordanburger.app',
    brand: {
      primary: '#365B4D',
      accent: '#D59A54',
      pale: '#E5EFE8',
      ink: '#26382F',
    },
    currency: 'JOD',
    deliveryEnabled: true,
    deliveryFeeFils: 1000,
    minimumOrderFils: 4000,
    categories: ['burgers', 'sides', 'coldDrinks'],
    products: [
      {
        id: 'smash-burger',
        name: 'Amman smash',
        nameAr: 'سماش عمّان',
        description: 'Crispy-edged beef, house sauce, pickled onion.',
        descriptionAr: 'لحم بقري مقرمش، صلصة الدار، وبصل مخلل.',
        category: 'burgers',
        priceFils: 5750,
        icon: 'hamburger',
        featured: true,
      },
      {
        id: 'zaatar-chicken',
        name: 'Zaatar chicken',
        nameAr: 'دجاج بالزعتر',
        description: 'Grilled chicken, zaatar mayo, crisp lettuce.',
        descriptionAr: 'دجاج مشوي، مايونيز بالزعتر، وخس مقرمش.',
        category: 'burgers',
        priceFils: 5250,
        icon: 'food',
        featured: true,
      },
      {
        id: 'sumac-fries',
        name: 'Sumac fries',
        nameAr: 'بطاطا بالسماق',
        description: 'Golden fries dusted with sumac and sea salt.',
        descriptionAr: 'بطاطا ذهبية بالسماق وملح البحر.',
        category: 'sides',
        priceFils: 2500,
        icon: 'french-fries',
      },
      {
        id: 'lemon-mint',
        name: 'Lemon & mint',
        nameAr: 'ليمون ونعناع',
        description: 'Freshly squeezed, with a cool mint finish.',
        descriptionAr: 'ليمون طازج مع لمسة منعشة من النعناع.',
        category: 'coldDrinks',
        priceFils: 2250,
        icon: 'cup-water',
      },
    ],
    rewards: [
      {
        id: 'fries-reward',
        name: 'Fries on the side',
        nameAr: 'بطاطا جانبية',
        description: 'One serving of sumac fries.',
        descriptionAr: 'حصة واحدة من البطاطا بالسماق.',
        pointsCost: 220,
        icon: 'french-fries',
      },
      {
        id: 'burger-upgrade',
        name: 'Make it a meal',
        nameAr: 'حوّلها إلى وجبة',
        description: 'Add fries and a drink to any burger.',
        descriptionAr: 'أضف البطاطا ومشروباً إلى أي برغر.',
        pointsCost: 460,
        icon: 'hamburger',
      },
    ],
    challenge: {
      title: 'The lunch run',
      titleAr: 'استراحة الغداء',
      description: 'Try 2 different burgers this month.',
      descriptionAr: 'جرّب نوعين مختلفين من البرغر هذا الشهر.',
      progress: 1,
      target: 2,
      rewardPoints: 80,
    },
  },
  'petra-pizza': {
    id: 'petra-pizza',
    name: 'Petra Pizza',
    nameAr: 'بيترا بيتزا',
    tagline: 'Stone-baked, shared often.',
    taglineAr: 'مخبوزة بالحجر، لتُشارك دائماً.',
    neighborhood: 'Abdoun, Amman',
    neighborhoodAr: 'عبدون، عمّان',
    icon: 'pizza',
    applicationId: 'com.petrapizza.app',
    brand: {
      primary: '#A64F3E',
      accent: '#DBA35D',
      pale: '#F5E5D9',
      ink: '#432B27',
    },
    currency: 'JOD',
    deliveryEnabled: true,
    deliveryFeeFils: 1000,
    minimumOrderFils: 5000,
    categories: ['pizza', 'sides', 'coldDrinks'],
    products: [
      {
        id: 'margherita',
        name: 'Margherita',
        nameAr: 'مارغريتا',
        description: 'San Marzano tomato, mozzarella, sweet basil.',
        descriptionAr: 'طماطم سان مارزانو، موزاريلا، وريحان طازج.',
        category: 'pizza',
        priceFils: 5500,
        icon: 'pizza',
        featured: true,
        variants: [
          { id: 'personal', name: 'Personal', nameAr: 'صغيرة', priceFils: 5500 },
          { id: 'sharing', name: 'Sharing', nameAr: 'للمشاركة', priceFils: 8500 },
        ],
      },
      {
        id: 'roasted-mushroom',
        name: 'Roasted mushroom',
        nameAr: 'فطر مشوي',
        description: 'Roasted mushroom, thyme, mozzarella, olive oil.',
        descriptionAr: 'فطر مشوي، زعتر، موزاريلا، وزيت زيتون.',
        category: 'pizza',
        priceFils: 7000,
        icon: 'pizza',
        featured: true,
      },
      {
        id: 'garlic-bread',
        name: 'Garlic bread',
        nameAr: 'خبز بالثوم',
        description: 'Stone-baked dough with garlic and herbs.',
        descriptionAr: 'عجين مخبوز بالحجر مع الثوم والأعشاب.',
        category: 'sides',
        priceFils: 2250,
        icon: 'bread-slice-outline',
      },
      {
        id: 'sparkling-citrus',
        name: 'Sparkling citrus',
        nameAr: 'حمضيات فوّارة',
        description: 'Citrus, sparkling water, a little rosemary.',
        descriptionAr: 'حمضيات وماء فوّار مع لمسة من إكليل الجبل.',
        category: 'coldDrinks',
        priceFils: 2500,
        icon: 'cup-water',
      },
    ],
    rewards: [
      {
        id: 'garlic-reward',
        name: 'Garlic bread',
        nameAr: 'خبز بالثوم',
        description: 'A side of stone-baked garlic bread.',
        descriptionAr: 'طبق جانبي من خبز الثوم المخبوز بالحجر.',
        pointsCost: 250,
        icon: 'bread-slice-outline',
      },
      {
        id: 'pizza-reward',
        name: 'A pizza to share',
        nameAr: 'بيتزا للمشاركة',
        description: 'Choose a sharing-size Margherita.',
        descriptionAr: 'اختر بيتزا مارغريتا بحجم المشاركة.',
        pointsCost: 700,
        icon: 'pizza',
      },
    ],
    challenge: {
      title: 'A little variety',
      titleAr: 'جرّب نكهة جديدة',
      description: 'Order from 2 different menu categories.',
      descriptionAr: 'اطلب من فئتين مختلفتين من القائمة.',
      progress: 1,
      target: 2,
      rewardPoints: 70,
    },
  },
  'sweet-spot': {
    id: 'sweet-spot',
    name: 'Sweet Spot Bakery',
    nameAr: 'مخبز سويت سبوت',
    tagline: 'Something lovely, fresh from the oven.',
    taglineAr: 'شيء لذيذ، خرج للتو من الفرن.',
    neighborhood: 'Rainbow Street, Amman',
    neighborhoodAr: 'شارع الرينبو، عمّان',
    icon: 'cupcake',
    applicationId: 'com.sweetspotbakery.app',
    brand: {
      primary: '#96546C',
      accent: '#D89577',
      pale: '#F4E6EA',
      ink: '#442E38',
    },
    currency: 'JOD',
    deliveryEnabled: true,
    deliveryFeeFils: 750,
    minimumOrderFils: 2000,
    categories: ['pastries', 'desserts', 'bread'],
    products: [
      {
        id: 'pistachio-croissant',
        name: 'Pistachio croissant',
        nameAr: 'كرواسون بالفستق',
        description: 'Flaky layers, pistachio cream, toasted nuts.',
        descriptionAr: 'طبقات هشة، كريمة الفستق، ومكسرات محمصة.',
        category: 'pastries',
        priceFils: 2750,
        icon: 'food-croissant',
        featured: true,
      },
      {
        id: 'zaatar-manoushe',
        name: 'Zaatar manoushe',
        nameAr: 'منقوشة زعتر',
        description: 'Warm flatbread with olive oil and wild zaatar.',
        descriptionAr: 'خبز دافئ بزيت الزيتون والزعتر البلدي.',
        category: 'bread',
        priceFils: 2500,
        icon: 'bread-slice-outline',
        featured: true,
      },
      {
        id: 'mini-kunafa',
        name: 'Mini kunafa',
        nameAr: 'كنافة صغيرة',
        description: 'A warm little kunafa with orange blossom syrup.',
        descriptionAr: 'كنافة دافئة صغيرة مع قطر زهر البرتقال.',
        category: 'desserts',
        priceFils: 3500,
        icon: 'cupcake',
      },
      {
        id: 'cinnamon-roll',
        name: 'Cinnamon roll',
        nameAr: 'لفافة القرفة',
        description: 'Soft, warmly spiced, finished with a light glaze.',
        descriptionAr: 'طرية بالقرفة ولمسة خفيفة من التزيين.',
        category: 'pastries',
        priceFils: 3000,
        icon: 'food-drumstick-outline',
      },
    ],
    rewards: [
      {
        id: 'pastry-reward',
        name: 'A pastry for later',
        nameAr: 'معجنات لوقت لاحق',
        description: 'Choose one pastry from today’s selection.',
        descriptionAr: 'اختر قطعة معجنات من تشكيلة اليوم.',
        pointsCost: 280,
        icon: 'food-croissant',
      },
      {
        id: 'kunafa-reward',
        name: 'Mini kunafa',
        nameAr: 'كنافة صغيرة',
        description: 'A little warm kunafa, on us.',
        descriptionAr: 'كنافة دافئة صغيرة على حسابنا.',
        pointsCost: 500,
        icon: 'cupcake',
      },
    ],
    challenge: {
      title: 'Bake a memory',
      titleAr: 'لحظة حلوة',
      description: 'Visit on 3 different days this month.',
      descriptionAr: 'زرنا في ٣ أيام مختلفة هذا الشهر.',
      progress: 2,
      target: 3,
      rewardPoints: 60,
    },
  },
};

export const DEFAULT_RESTAURANT_ID = 'amman-coffee';
export const RESTAURANT_LIST = Object.values(RESTAURANTS);

export function getProductPrice(product: MenuProduct, variantId?: string) {
  return product.variants?.find((variant) => variant.id === variantId)?.priceFils
    ?? product.priceFils;
}
