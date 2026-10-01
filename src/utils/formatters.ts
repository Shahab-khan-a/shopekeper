/**
 * Smart compact number formatter for prices and currency amounts in POS cards and bill totals.
 * Examples:
 *   850        -> "850"
 *   1,200      -> "1.2k"
 *   10,000     -> "10k"
 *   150,000    -> "150k"
 *   1,000,000  -> "1M"
 *   2,500,000  -> "2.5M"
 *   1,000,000,000 -> "1B"
 */
export function formatCompactPrice(price: number): string {
  if (price === undefined || price === null || isNaN(price)) return '0';

  const abs = Math.abs(price);
  if (abs >= 1_000_000_000) {
    const val = price / 1_000_000_000;
    return (val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)) + 'B';
  }
  if (abs >= 1_000_000) {
    const val = price / 1_000_000;
    return (val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)) + 'M';
  }
  if (abs >= 1_000) {
    const val = price / 1_000;
    return (val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)) + 'k';
  }

  return price.toLocaleString();
}
