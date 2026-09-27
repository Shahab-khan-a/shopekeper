import { ProductCategory } from '@/types';

export const ImageService = {
  /**
   * Evaluates an image URI and determines if it is a local file or remote URL.
   */
  isLocalUri(uri?: string | null): boolean {
    if (!uri) return false;
    return (
      uri.startsWith('file://') ||
      uri.startsWith('content://') ||
      uri.startsWith('data:') ||
      uri.startsWith('/')
    );
  },

  /**
   * Returns a category-specific fallback icon name from Ionicons
   * when no image exists or when offline and uncached.
   */
  getCategoryIcon(category: ProductCategory): string {
    switch (category) {
      case 'Beverages':
        return 'wine';
      case 'Dairy':
        return 'water';
      case 'Snacks':
        return 'fast-food';
      case 'Spices':
        return 'flame';
      case 'Bakery':
        return 'cafe';
      case 'Personal Care':
        return 'heart';
      case 'Grocery':
      case 'Kiryana':
        return 'cart';
      default:
        return 'cube';
    }
  },
};
