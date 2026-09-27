import { Product, CustomerKhata, ShopSettings } from '@/types';

export const INITIAL_SETTINGS: ShopSettings = {
  profileImage: undefined,
  shopName: 'My Store',
  shopNameUrdu: 'میری دکان',
  ownerName: '',
  businessType: 'General Store',
  email: '',
  address: '',
  city: '',
  phone: '',
  alternatePhone: '',
  taxNumber: '',
  paymentDetails: '',
  businessHours: '09:00 AM - 10:00 PM',
  currencySymbol: 'Rs.',
  footerNote: 'Thank you for shopping with us! Please visit again.',
  footerNoteUrdu: 'خریداری کا شکریہ! دوبارہ تشریف لائیں۔',
  lowStockThreshold: 5,
  language: 'ur',
  darkMode: false,
  enableSound: true,
};

/**
 * Dynamically resolves and creates shop settings for any authenticated user
 */
export function getDynamicSettings(
  user?: { displayName?: string | null; email?: string | null; photoURL?: string | null } | null,
  existing?: Partial<ShopSettings> | null
): ShopSettings {
  const displayName = user?.displayName?.trim() || '';
  const email = user?.email?.trim() || '';

  const isDummyOwner =
    !existing?.ownerName ||
    existing.ownerName.trim() === '' ||
    existing.ownerName === 'Muhammad Kamran' ||
    existing.ownerName === 'Shop Owner';

  const isDummyShop =
    !existing?.shopName ||
    existing.shopName.trim() === '' ||
    existing.shopName === 'Madina Super Store' ||
    existing.shopName === 'My Store';

  const isDummyShopUrdu =
    !existing?.shopNameUrdu ||
    existing.shopNameUrdu.trim() === '' ||
    existing.shopNameUrdu === 'مدینہ سپر اسٹور اینڈ کریانہ' ||
    existing.shopNameUrdu === 'میری دکان';

  const isDummyEmail =
    !existing?.email ||
    existing.email.trim() === '' ||
    existing.email === 'madinastore.lhr@gmail.com';

  const resolvedOwner = (!isDummyOwner && existing?.ownerName) ? existing.ownerName : (displayName || existing?.ownerName || '');
  const resolvedShopName = (!isDummyShop && existing?.shopName) ? existing.shopName : (displayName ? `${displayName}'s Store` : (existing?.shopName || 'My Store'));
  const resolvedShopNameUrdu = (!isDummyShopUrdu && existing?.shopNameUrdu) ? existing.shopNameUrdu : (displayName ? `${displayName} اسٹور` : (existing?.shopNameUrdu || 'میری دکان'));
  const resolvedEmail = (!isDummyEmail && existing?.email) ? existing.email : (email || existing?.email || '');
  const isGoogleAvatar = existing?.profileImage?.includes('googleusercontent.com');
  const resolvedPhoto = (!isGoogleAvatar && existing?.profileImage?.trim()) ? existing.profileImage.trim() : undefined;

  return {
    ...INITIAL_SETTINGS,
    ...existing,
    profileImage: resolvedPhoto,
    shopName: resolvedShopName,
    shopNameUrdu: resolvedShopNameUrdu,
    ownerName: resolvedOwner,
    email: resolvedEmail,
  };
}

export const DUMMY_PRODUCT_IDS = [
  'prod-1',
  'prod-2',
  'prod-3',
  'prod-4',
  'prod-5',
  'prod-6',
  'prod-7',
  'prod-8',
  'prod-9',
  'prod-10',
];

export const DUMMY_CUSTOMER_IDS = ['cust-1', 'cust-2'];

export const DUMMY_TX_IDS = ['tx-1', 'tx-2', 'tx-3'];

export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_KHATA: CustomerKhata[] = [];

/**
 * Starter JSON for the Settings > Restore box.
 */
export const buildImportTemplateJSON = (): string => {
  return JSON.stringify(
    {
      products: [],
    },
    null,
    2
  );
};

