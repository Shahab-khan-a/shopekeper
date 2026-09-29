export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
  nameUrdu: string;
  flag: string;
}

export const CURRENCIES: CurrencyOption[] = [
  { code: 'PKR', symbol: 'Rs.', name: 'Pakistani Rupee', nameUrdu: 'پاکستانی روپیہ', flag: '🇵🇰' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', nameUrdu: 'بھارتی روپیہ', flag: '🇮🇳' },
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', nameUrdu: 'بنگلہ دیشی ٹکا', flag: '🇧🇩' },
  { code: 'AFN', symbol: '؋', name: 'Afghan Afghani', nameUrdu: 'افغانی', flag: '🇦🇫' },
  { code: 'NPR', symbol: 'रू', name: 'Nepalese Rupee', nameUrdu: 'نیپالی روپیہ', flag: '🇳🇵' },
  { code: 'LKR', symbol: 'Rs', name: 'Sri Lankan Rupee', nameUrdu: 'سری لنکن روپیہ', flag: '🇱🇰' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham', nameUrdu: 'اماراتی درہم', flag: '🇦🇪' },
  { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal', nameUrdu: 'سعودی ریال', flag: '🇸🇦' },
  { code: 'QAR', symbol: 'QAR', name: 'Qatari Riyal', nameUrdu: 'قطری ریال', flag: '🇶🇦' },
  { code: 'OMR', symbol: 'OMR', name: 'Omani Rial', nameUrdu: 'عمانی ریال', flag: '🇴🇲' },
  { code: 'KWD', symbol: 'KWD', name: 'Kuwaiti Dinar', nameUrdu: 'کویتی دینار', flag: '🇰🇼' },
  { code: 'BHD', symbol: 'BHD', name: 'Bahraini Dinar', nameUrdu: 'بحرینی دینار', flag: '🇧🇭' },
  { code: 'USD', symbol: '$', name: 'US Dollar', nameUrdu: 'امریکی ڈالر', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro', nameUrdu: 'یورو', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound', nameUrdu: 'برطانوی پاؤنڈ', flag: '🇬🇧' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', nameUrdu: 'کینیڈین ڈالر', flag: '🇨🇦' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', nameUrdu: 'آسٹریلوی ڈالر', flag: '🇦🇺' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira', nameUrdu: 'ترک لیرا', flag: '🇹🇷' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', nameUrdu: 'ملائیشین رنگٹ', flag: '🇲🇾' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', nameUrdu: 'انڈونیشین روپیہ', flag: '🇮🇩' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', nameUrdu: 'چینی یوآن', flag: '🇨🇳' },
  { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound', nameUrdu: 'مصری پاؤنڈ', flag: '🇪🇬' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', nameUrdu: 'نائجیرین نائرا', flag: '🇳🇬' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', nameUrdu: 'کینیائی شلنگ', flag: '🇰🇪' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', nameUrdu: 'جنوبی افریقی رینڈ', flag: '🇿🇦' },
];

const normalize = (s: string) => s.trim().replace(/\.$/, '').toLowerCase();

/**
 * Resolves the saved currency. `code` is '' for a custom symbol.
 * Settings saved before the picker existed only have a symbol (e.g. 'Rs.', 'Rs', 'PKR'),
 * so fall back to matching it against each currency's symbol or code.
 */
export function findCurrency(code: string | undefined, symbol: string): CurrencyOption | undefined {
  if (code !== undefined) {
    return code ? CURRENCIES.find((c) => c.code === code) : undefined;
  }
  const s = normalize(symbol);
  return CURRENCIES.find((c) => normalize(c.symbol) === s || c.code.toLowerCase() === s);
}
