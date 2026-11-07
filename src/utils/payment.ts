import { Sale, PaymentMethod } from '@/types';

export interface PaymentBreakdown {
  cleanPaid: number;
  baki: number;
  isSplit: boolean;
  paymentMethod: PaymentMethod;
}

/**
 * Derives normalized payment amounts and split status for a sale.
 * Ensures amountPaid never exceeds grandTotal and baki is never negative.
 */
export function getPaymentBreakdown(
  sale: Pick<Sale, 'grandTotal' | 'amountPaid' | 'paymentMethod'>
): PaymentBreakdown {
  const grandTotal = Number(sale?.grandTotal || 0);
  const rawPaid =
    sale?.amountPaid !== undefined && sale?.amountPaid !== null
      ? Number(sale.amountPaid)
      : sale?.paymentMethod === 'udhaar'
      ? 0
      : grandTotal;

  const cleanPaid = Math.min(grandTotal, Math.max(0, rawPaid));
  const baki = sale?.paymentMethod === 'udhaar' ? Math.max(0, grandTotal - cleanPaid) : 0;
  const isSplit = sale?.paymentMethod === 'udhaar' && cleanPaid > 0 && baki > 0;

  return {
    cleanPaid,
    baki,
    isSplit,
    paymentMethod: sale?.paymentMethod || 'cash',
  };
}

